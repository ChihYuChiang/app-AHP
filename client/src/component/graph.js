import React from "react";

import drawTreeGraph from "../js/treeGraph";
import CONST from "../js/const";


//In React DOM, there's always <svg /> only (no change at all), the d3 code implements on top of that 
function Graph (props) {
  /*
    props = {
      curGraph //The graph to be shown
      root //Data for the hierarchical graph
    }
  */
  if (props.curGraph == null) {
    return <div id="canvasRoot" style={{ display: "none" }} />;
  }
  else {
    drawTreeGraph(props.root, props.options, props.curGraph);
    return <div id="canvasRoot" style={{ display: "block" }} />;
  }
}


export default Graph;