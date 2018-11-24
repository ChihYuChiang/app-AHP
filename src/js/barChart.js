import * as d3 from "d3";

import styles from '../scss/variable.scss';


function main(datum) {
  console.log(datum)
  //Graph root
  let [height, width] = [67, 100];
  let gr = d3.select("svg")
    .append("g")
    .attr("id", "barRoot")
    //(0, 0) is the root node, (dx, dy) is the shift of the tree from the origin
    .attr("transform", `translate(${datum.y + datum.dx + 5}, ${datum.x + datum.dy + height + 15})`)
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
    .attr("fill", (_, i) => {
      let color = d3.hsl(hueScale(i));
      color.l = 0.7;
      return color;
    })
    .attr("x", (_, i) => xScale(i))
    .attr("y", height)
    .attr("height", 0)
    .attr("width", xScale.bandwidth())
    .transition(barTransition)
    .delay((_, i) => i * 150)
    .attr("y", (d) => height - yScale(d))
    .attr("height", (d) => yScale(d))
}


function genScales(datum, height, width) {
  let xScale = d3.scaleBand()
    .domain([...datum.data.score.keys()])
    .range([0, width])
    .padding(0.1);
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(datum.data.score, d => d)])
    .nice() //Extend the domain to round values
    .range([0, height]);

  let hueScale = d3.scaleOrdinal()
    .domain([...datum.data.score.keys()]) //The option ids; keys() return an iterator
    .range(d3.schemeCategory10);

  return [xScale, yScale, hueScale];
}


export default main;