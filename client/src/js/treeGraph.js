import * as d3 from "d3";

import CONST from "./const";
import interaction from "./treegraph_inter";
import util from "./util";
import styles from "../scss/variable.scss";

function main(root, options, graphType) {
  //If there's additional interaction
  let inter = [
    CONST.GRAPH_TYPE.TREE_DEMO,
    CONST.GRAPH_TYPE.TREE_UPDATE,
    CONST.GRAPH_TYPE.TREE_RECORD
  ].includes(graphType)
    ? true
    : false;

  //Clear current graph
  d3.select("#canvasRoot")
    .selectAll("*")
    .remove();

  //Generate tree layout
  root.dx = 40; //The min distance between 2 nodes at the same level (vertically in this graph)
  root.dy = 400 / root.height; //The distance between levels (horizontally in this graph)
  let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
  treeLayout(root);

  //Identify graph boundary
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  //Dashboard
  //#canvasRoot -> #dashboard -> #information and #legend
  let dashboard = d3
    .select("#canvasRoot")
    .append("div")
    .attr("id", "dashboard")
    .classed("float-left", true)
    .classed("position-sticky", true);

  let legend = dashboard
    .append("div")
    .attr("id", "legend")
    legend
      .append("p")
      .attr("id", "legend-title");
    legend
      .append("svg")
      .style("width", "100%")
      .style("height", options.length * CONST.GRAPH_MEASURE.LEGEND_ITEM_HEIGHT);
    
  let information = dashboard
    .append("div")
    .attr("id", "information");
  information
    .append("div")
    .attr("id", "head-information")
    .style("font-size", "25px");
  information
    .append("span")
    .attr("id", "sub-information");

  //Setup svg
  const width_svg = 550;
  const height_svg = x1 - x0 + root.dx * 2 + CONST.GRAPH_MEASURE.BAR_HEIGHT / 2;
  const svg = d3.select("#canvasRoot")
    .append("svg")
    .style("width", width_svg)
    .style("height", height_svg);

  //Graph root
  //#canvasRoot -> svg -> g -> g.links and g.nodes
  root.transX = root.dy / 3; //Origin translate (the root node in the graph)
  root.transY = root.dx - x0 + (inter ? CONST.GRAPH_MEASURE.BAR_HEIGHT / 2 : 0);
  let gr = svg
    .append("g")
    .attr("id", "treeRoot")
    .attr("transform", `translate(${root.transX}, ${root.transY})`);
  gr.append("g").attr("id", "links");
  gr.append("g").attr("id", "nodes");

  //Actually draw graph
  produceTreeGraph(root, options, inter);
  if (inter) produceLegend(root, options);
}


function produceTreeGraph(root, options, inter) {
  let rootElement = d3.select("#treeRoot");

  //Links (curvy)
  let linkPaths = rootElement
    .select("#links")
    .selectAll("path.link")
    .data(root.links());
  linkPaths
    .enter()
    .append("path")
    .classed("link", true)
    .attr("fill", "none")
    .attr("stroke", styles.gray300)
    .merge(linkPaths) //Both enter and update
    .attr(
      "d",
      d => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
          ${d.source.y + root.dy / 2},${d.source.x}
          ${d.source.y},${d.source.x}
        `
    );

  //Nodes
  let nodeGs = rootElement
    .select("#nodes")
    .selectAll("g.node")
    .data(root.descendants());

  let nodeGs_enter = nodeGs
    .enter()
    .append("g")
    .classed("node", true);
  nodeGs_enter
    .append("circle")
    .classed("node_circle", true);
  nodeGs_enter
    .append("circle")
    .classed("node_listener", true)
    .style("opacity", 0)
    .on("mouseover", (d) => {interaction.resumeClicked_legend(); interaction.highlightHovered(d);})
    .on("mouseleave", interaction.resumeHovered);
  nodeGs_enter
    .append("text")
    .classed("node_text", true)
    .attr("fill", styles.gray900)
    .attr("text-anchor", "middle");

  let nodeGs_enter8Update = nodeGs_enter.merge(nodeGs); //Under current design, no update will be made
  nodeGs_enter8Update
    .attr("transform", d => `translate(${d.y}, ${d.x})`) //Swap x and y to make the graph horizontal
    .datum(d => {
      //Pass option info to each node (for bar chart)
      d.options = options;
      d.transX = root.transX;
      d.transY = root.transY;
      d.inter = inter;
      d.topOptId = inter
       ? d.data.score.reduce((acc, cur, i) => (cur > d.data.score[acc] ? i : acc), 0) + 1 //Option id starts from 1
       : 0
      return d;
    })
    .each(function(d) {d3.select(this).classed("topOptId_" + d.topOptId, true);});
  nodeGs_enter8Update
    .select(".node_circle")
    .attr("r", d => getCircleR(d.data.parWeight, inter))
    .attr("fill", d => {
      if (!inter) return styles.primary;
      else {
        let [hueScale, lightnessScale] = genScales(root);
        let colorHue = hueScale(d.topOptId);
        let color = d3.hsl(colorHue);
        color.l = lightnessScale(d.data.score[d.topOptId - 1]);
        return color;
      }
    });
  nodeGs_enter8Update
    .select(".node_text")
    .text(d => d.data.name)
    .attr("dy", d => -getCircleR(d.data.parWeight, inter) - 6)
    .style("pointer-events", "none");
  nodeGs_enter8Update //Mouse event listener
    .select(".node_listener")
    .attr("r", d => getCircleR(d.data.parWeight, inter) + 10);
}

function produceLegend(root, options) {
  let [hueScale] = genScales(root); //TODO: lightness legend

  d3.select("#legend > p")
    .text("Options");

  var legendItems = d3.select("#legend > svg")
    .selectAll(".legendItem")
    .data(options)
    .enter()
    .append("g")
    .classed("legendItem", true)
    .attr("transform", (_, i) => "translate(0," + i * CONST.GRAPH_MEASURE.LEGEND_ITEM_HEIGHT + ")")
    .on("click", interaction.highlightClicked_legend);
  d3.select("#canvasRoot > svg") //Click the svg to resume
    .on("click", interaction.resumeClicked_legend);
  legendItems
    .append("rect")
    .attr("rx", "2px")
    .attr("ry", "2px")    
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (_, i) => {
      let color = d3.hsl(hueScale(i + 1));
      color.l = 0.7;
      return color;
    });
  legendItems
    .append("text")
    .attr("x", 20)
    .attr("y", 10)
    .attr("dy", "-1px")
    .attr("dx", "-5px")
    .text((d) => d.name)
    .style("text-anchor", "start")
    .style("fill", styles.gray800)
    .style("font-size", 12);
}


function genScales(root) {
  let nOptions = root.data.score.length;
  let lightnessScale = d3
    .scaleLinear()
    .domain([1 / nOptions, (nOptions * 0.8) / nOptions])
    .range([0.9, 0.5])
    .clamp(true);
  let hueScale = d3 //1, 2, .., nOptions
    .scaleOrdinal()
    .domain(util.range(1, nOptions + 1))
    .range(d3.schemeCategory10);
  return [hueScale, lightnessScale];
}

function getCircleR(parWeight, inter) {
  return inter ? Math.pow(parWeight, 0.4) * 30 : 4; //TODO: base on the minimum value
}


export { main as default, getCircleR };
