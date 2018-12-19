import * as d3 from "d3";

import CONST from "./const";
import drawBarChart from './barchart';
import { getCircleR } from './treegraph';


class main {
  
  static highlightHovered(datum) {

    //--Base interaction (not updated graph)
    d3.select("#information").style("visibility", () =>
      datum.inter ? "visible" : "hidden"
    );
    d3.select("#head-information").text(
      datum.inter ? (datum.data.parWeight * 100).toFixed(2) + "%" : ""
    );
    d3.select("#sub-information").text("of final score comes from this criterion");
  
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
  

    //--Rich interaction
    if (datum.inter) {
      let curCircle = d3.selectAll(".node_circleWrapper")
        .filter(d => datum.id === d.id);
      curCircle  
        .transition()
        .duration(350)
        .attr("transform",`translate(${0}, ${getCircleR(datum.data.parWeight, datum.inter) + 5})`)
        .on("interrupt", () => {
          curCircle
            .attr("transform",`translate(${0}, ${0})`);
        });
      let curLabel = d3.selectAll(".node_text")
        .filter(d => datum.id === d.id)
        .style("visibility", "hidden")
        .attr("transform",`translate(${CONST.GRAPH_MEASURE.BAR_WIDTH / 2 - 3}, ${getCircleR(datum.data.parWeight, datum.inter) + 27})`)
        .attr("font-size", "1.2em");
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
    
    //--Base interaction (not updated graph)
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
    
    //--Rich interaction
    if (datum.inter) {
      let curCircle = d3.selectAll(".node_circleWrapper")
        .filter(d => datum.id === d.id);
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
        .attr("font-size", "1em");
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

  static highlightClicked_legend(datum) {
    //If self is not dimmed and others are dimmed, toggle
    let selfOpacity = +d3.select(".topOptId_" + datum.id).style("opacity");
    let otherOpacity = +d3.select(".topOptId_" + (!(datum.id - 1) + 1)).style("opacity");
    if (selfOpacity === 1 && otherOpacity !== 1) {
      main.resumeClicked_legend();
      return;
    }

    d3.selectAll(".node, .legendItem")
      .style("opacity", 0.3);
    d3.selectAll(".topOptId_" + datum.id)
      .style("opacity", 1);
  }
  
  static resumeClicked_legend() {
    d3.selectAll(".node, .legendItem").style("opacity", 1);
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