import * as d3 from "d3";

import util from "./util";
import CONST from "./const";


function main(datum) {
  //Graph root
  let [height, width] = [CONST.GRAPH_MEASURE.BAR_HEIGHT, CONST.GRAPH_MEASURE.BAR_WIDTH];
  let gr = d3.select("#canvasRoot>svg")
    .append("g")
    .attr("id", "barRoot")
    //(0, 0) is the root node, (dx, dy) is the shift of the tree from the origin
    .attr("transform", `translate(${datum.y + datum.transX - 3}, ${datum.x + datum.transY - height + 1})`)
    .style("pointer-events", "none");
  
  //Scales
  let [xScale, yScale, hueScale] = genScales(datum, height, width);
  
  //Draw bars
  let barGs = gr
    .selectAll("g.bar")
    .data(datum.data.score)
    .enter()
      .append("g")
      .classed("bar", true);
  
  let barTransition = d3.transition()
    .duration(600)
    .ease(d3.easeQuadOut);
  barGs
    .append("rect")
    .attr("rx", "3px")
    .attr("ry", "3px")
    .attr("fill", (_, i) => {
      let color = d3.hsl(hueScale(i + 1));
      color.l = 0.7;
      return color;
    })
    .attr("x", (_, i) => xScale(i + 1))
    .attr("y", height)
    .attr("height", 0)
    .attr("width", xScale.bandwidth())
    .transition(barTransition)
    .delay((_, i) => i * 150)
    .attr("y", (d) => height - yScale(d))
    .attr("height", (d) => yScale(d))
}


function genScales(datum, height, width) {
  let xScale = d3.scaleBand()  //1, 2, .., nOptions
    .domain(util.range(1, datum.data.score.length + 1))
    .range([0, width])
    .padding(0.1);
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(datum.data.score, d => d)])
    .nice() //Extend the domain to round values
    .range([0, height]);

  let hueScale = d3 //1, 2, .., nOptions
    .scaleOrdinal()
    .domain(util.range(1, datum.data.score.length + 1))
    .range(d3.schemeCategory10);

  return [xScale, yScale, hueScale];
}


export default main;