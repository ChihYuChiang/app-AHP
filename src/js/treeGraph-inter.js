import * as d3 from "d3";

import drawBarChart from './barChart';
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
      .style("opacity", 0.3);
    let labels = d3
      .selectAll(".node_text")
      .style("opacity", 0.3);
    let links = d3
      .selectAll(".link")
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
    ancestorCircles.style("opacity", 1);
    ancestorLabels.style("opacity", 1);
    ancestorLinks.style("opacity", 1);
  
    if (typeof datum.data.score !== "undefined") {
      d3.selectAll(".node_circle")
        .filter(d => datum.id === d.id)
        .transition(800)
        .attr(
          "transform",
          `translate(${0}, ${Math.pow(datum.data.parWeight, 0.5) * 30 + 5})`
        );
  
      drawBarChart(datum);
    }
  }
  
  static resumeHovered(datum) {
    d3.select("#information").style("visibility", "hidden");
  
    d3.selectAll(".node_circle")
      .transition(800)
      .style("opacity", 1);
    d3.selectAll(".node_text")
      .transition(800)
      .style("opacity", 1);
    d3.selectAll(".link")
      .transition(800)
      .style("opacity", 1);

    if (typeof datum.data.score !== "undefined") {
      d3.selectAll(".node_circle")
        .filter(d => datum.id === d.id)
        .transition(800)
        .attr("transform", `translate(${0}, ${0})`);

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