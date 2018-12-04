import React from "react";

import { DivPosedTransY } from './pose';

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
  if ([CONST.GRAPH_TYPE.NULL, CONST.GRAPH_TYPE.COMPARISON].includes(props.curGraph)) {
    return <DivPosedTransY id="canvasRoot" style={{ display: "none" }} pose='exit'/>;
  }
  else {
    drawTreeGraph(props.root, props.options, props.curGraph);
    return <DivPosedTransY id="canvasRoot" style={{ display: "block" }} pose='enter'/>;
  }
}


export default Graph;