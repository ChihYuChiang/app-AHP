import * as d3 from "d3";

import drawBarChart from './barChart';
import styles from '../scss/variable.scss';


function main(root, options) {
  //Identify graph boundary
  root = genTreeLayout(root);
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  //Setup svg
  const svg = d3
    .select("svg")
    .style("width", "100%")
    .style("height", x1 - x0 + root.dx * 2);
  
  //Information
  let explanation = d3.select("#canvasRoot")
    .append("div")
    .attr("id", "explanation");
  
  explanation
    .append("div")
    .attr("id", "head-explanation")
    .style("font-size", "25px");
    
  explanation  
    .append("span")
    .attr("id", "sub-explanation")

  //Graph root
  //svg -> g -> g.links and g.nodes
  let gr = svg
    .append("g")
    .attr("id", "treeRoot")
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
  gr.append("g").attr("id", "links");
  gr.append("g").attr("id", "nodes");

  //Initial update
  updateTreeGraph(root, options);
}


function genTreeLayout(root) {
  root.dx = 30;
  root.dy = 500 / (root.height + 1);
  let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
  treeLayout(root);

  return root;
}

function updateTreeGraph(root, options) {
  root = genTreeLayout(root);
  let rootElement = d3.select("#treeRoot");

  //Links (curvy)
  let linkPaths = rootElement
    .select("#links")
    .selectAll("path.link")
    .data(root.links())
    
  linkPaths 
    .enter()
      .append("path")
      .classed("link", true)
      .attr("fill", "none")
      .attr("stroke", styles.gray300)
    .merge(linkPaths) //Both enter and update
      .attr("d", (d) => `
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
      .classed("node", true)
  
  nodeGs_enter
    .append("circle")
    .classed("node_circle", true)
    
  nodeGs_enter
    .append("text")
    .classed("node_text", true)
    .attr("fill", styles.black)
    .attr("text-anchor", "middle")
    .attr("dy", "-10px");

  nodeGs_enter
    .append("circle")
    .classed("node_listener", true)
    .style("opacity", 0)
    .on("mouseover", highlightHovered)
    .on("mouseleave", resumeHovered);

  let nodeGs_enter8Update = nodeGs_enter
    .merge(nodeGs);
    
  nodeGs_enter8Update
    .attr("transform", (d) => `translate(${d.y}, ${d.x})`) //Swap x and y to make the graph horizontal
    .datum((d) => { //Pass option info to each node (for bar chart)
      d.options = options;
      d.dx = root.dx;
      d.dy = root.dy;
      return d;
    });
    
  nodeGs_enter8Update
    .select(".node_circle")
    .attr("r", (d) => (Math.pow(d.data.parWeight, 0.5) * 30) || 4)
    .attr("fill", (d) => {
      if (d.data.score == null) return styles.primary;
      
      let [hueScale, lightnessScale] = genScales(root);
      let topOptId = d.data.score.reduce((acc, cur, i) => (cur > d.data.score[acc]) ? i : acc, 0);
      let colorHue = hueScale(topOptId);
      let color = d3.hsl(colorHue);
      color.l = lightnessScale(d.data.score[topOptId]);
      return color;
    });
  
  nodeGs_enter8Update
    .select(".node_text")
    .text((d) => d.data.name)
    .style("pointer-events", "none");

  nodeGs_enter8Update //Mouse event listener
    .select(".node_listener")
    .attr("r", (d) => ((Math.pow(d.data.parWeight, 0.5) * 30) || 4) + 10);
}

function genScales(root) {
  let nOptions = root.data.score.length;
  let lightnessScale = d3.scaleLinear()
    .domain([1 / nOptions, (nOptions * 0.8) / nOptions])
    .range([0.9, 0.5])
    .clamp(true);
  let hueScale = d3.scaleOrdinal()
    .domain([...root.data.score.keys()]) //The option ids; keys() return an iterator
    .range(d3.schemeCategory10);
  return [hueScale, lightnessScale];
}

function highlightHovered(datum) {
  d3.select("#explanation")
    .style("visibility", () => datum.data.parWeight ? "visible" : "hidden");
  d3.select("#head-explanation")
    .text(datum.data.parWeight ? (datum.data.parWeight * 100).toFixed(2) + "%" : "");
  d3.select("#sub-explanation")
    .text("of score come from this criterion");

  let circles = d3.selectAll(".node_circle")
    .transition(800)
    .style("opacity", 0.3);
  let links = d3.selectAll(".link")
    .transition(800)
    .style("opacity", 0.3);

  let ancestorIds = getAncestorIds(datum);
  let ancestorCircles = circles.filter((d) => {
    return ancestorIds.indexOf(d.id) >= 0;
  });
  let ancestorLinks = links.filter((d) => {
    return ancestorIds.indexOf(d.source.id) >= 0 && ancestorIds.indexOf(d.target.id) >= 0;
  })
  ancestorCircles
    .style("opacity", 1);
  ancestorLinks
    .style("opacity", 1);
  
  if (typeof datum.data.score !== "undefined") {
    d3.selectAll(".node_circle")
      .filter((d) => datum.id === d.id)
      .transition(800)
      .attr("transform", `translate(${0}, ${(Math.pow(datum.data.parWeight, 0.5) * 30) + 5})`);
    
    drawBarChart(datum);
  }
}

function resumeHovered(datum) {
  d3.select("#explanation")
    .style("visibility", "hidden");

  d3.selectAll(".node_circle")
    .transition(800)
    .style("opacity", 1);
  if (typeof datum.data.score !== "undefined") {
    d3.selectAll(".node_circle")
      .filter((d) => datum.id === d.id)
      .transition(800)
      .attr("transform", `translate(${0}, ${0})`);
  }
  
  d3.selectAll(".link")
    .transition(800)
    .style("opacity", 1);
  
  d3.select("#barRoot")
    .remove();
}

function getAncestorIds(d) {
  let ancestors = [];
  while (d.parent) {
    ancestors.unshift(d.id);
    d = d.parent;
  }
  ancestors.unshift('0-0'); //Include root
  return ancestors;
}


export { main as default, updateTreeGraph };
