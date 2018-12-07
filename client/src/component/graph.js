import React from "react";

import { DivPosedFadeY } from './pose';

import drawTreeGraph from "../js/treegraph";
import CONST from "../js/const";


//In React DOM, there's always <svg /> only (no change at all), the d3 code implements on top of that 
function Graph (props) {
  /*
    props = {
      curGraph //The graph to be shown
      root //Data for the hierarchical graph
    }
  */
  switch (props.curGraph) {
    case CONST.GRAPH_TYPE.NULL:
      return <DivPosedFadeY id="canvasRoot" style={{ display: "none" }} pose='exit'/>;
    
    default:
      drawTreeGraph(props.root, props.options, props.curGraph);
      return <DivPosedFadeY id="canvasRoot" style={{ display: "block" }} pose='enter'/>;
  }
}


export default Graph;