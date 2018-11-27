import * as d3 from "d3";

import drawBarChart from './barChart';
import { getCircleR } from './treeGraph';
import styles from '../scss/variable.scss';


class main {
  
  static highlightHovered(datum) {
    d3.select("#information").style("visibility", () =>
      datum.data.parWeight ? "visible" : "hidden"
    );
    d3.select("#head-information").text(
      datum.data.parWeight ? (datum.data.parWeight * 100).toFixed(2) + "%" : ""
    );
    d3.select("#sub-information").text("of score come from this criterion");
  
    let circles = d3
      .selectAll(".node_circle")
      .interrupt()
      .attr("transform",`translate(${0}, ${0})`)
      .style("opacity", 0.3);
    let labels = d3
      .selectAll(".node_text")
      .interrupt()
      .style("visibility", "visible")
      .style("opacity", 0.3);
    let links = d3
      .selectAll(".link")
      .interrupt()
      .style("opacity", 0.3);
  
    let ancestorIds = getAncestorIds(datum);
    let ancestorCircles = circles.filter(d => {
      return ancestorIds.indexOf(d.id) >= 0;
    });
    let ancestorLabels = labels.filter(d => {
      return ancestorIds.indexOf(d.id) >= 0;
    });
    let ancestorLinks = links.filter(d => {
      return (
        ancestorIds.indexOf(d.source.id) >= 0 &&
        ancestorIds.indexOf(d.target.id) >= 0
      );
    });
    ancestorCircles
      .interrupt()
      .style("opacity", 1);
    ancestorLabels
      .interrupt()
      .style("opacity", 1);
    ancestorLinks
      .interrupt()
      .style("opacity", 1);
  
    if (typeof datum.data.score !== "undefined") {
      let curCircle = d3.selectAll(".node_circle")
        .filter(d => datum.id === d.id)
      curCircle  
        .transition()
        .duration(350)
        .attr("transform",`translate(${0}, ${getCircleR(datum.data.parWeight) + 5})`)
        .on("interrupt", () => {
          curCircle
            .attr("transform",`translate(${0}, ${0})`);
        });
      let curLabel = d3.selectAll(".node_text")
        .filter(d => datum.id === d.id)
        .style("visibility", "hidden")
        .attr("transform",`translate(${getCircleR(datum.data.parWeight) + 5}, ${getCircleR(datum.data.parWeight) * 2 + 14})`)
        .attr("text-anchor", "start");
      curLabel
        .transition()
        .duration(200)
        .delay(200)
        .on("start", () => {
          curLabel
            .style("visibility", "visible")
            .style("opacity", 0);
        })
        .style("opacity", 1);
  
      drawBarChart(datum);
    }
  }
  
  static resumeHovered(datum) {
    d3.select("#information").style("visibility", "hidden");
  
    let circles = d3.selectAll(".node_circle");
    let labels = d3.selectAll(".node_text");
    let links = d3.selectAll(".link");
    circles
      .transition()
      .duration(300)
      .style("opacity", 1);
    labels
      .transition()
      .duration(300)
      .style("opacity", 1);
    links
      .transition()
      .duration(300)
      .style("opacity", 1);

    if (typeof datum.data.score !== "undefined") {
      let curCircle = d3.selectAll(".node_circle")
        .filter(d => datum.id === d.id)
      curCircle  
        .transition()
        .duration(300)
        .attr("transform", `translate(${0}, ${0})`)
        .on("interrupt", () => {
          curCircle
            .attr("transform", `translate(${0}, ${0})`);
        });
      let curLabel = d3.selectAll(".node_text")
        .filter(d => datum.id === d.id)
        .style("visibility", "hidden")
        .attr("transform", `translate(${0}, ${0})`)
        .attr("text-anchor", "middle");
      curLabel
        .transition()
        .duration(200)
        .on("start", () => {
          curLabel
            .style("visibility", "visible")
            .style("opacity", 0);
        })
        .style("opacity", 1);

      d3.select("#barRoot").remove();
    }
  }
    
}


function getAncestorIds(d) {
  let ancestors = [];
  while (d.parent) {
    ancestors.unshift(d.id);
    d = d.parent;
  }
  ancestors.unshift("0-0"); //Include root
  return ancestors;
}


export default main;