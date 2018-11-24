import React from "react";

import drawTreeGraph, { updateTreeGraph } from "../js/treeGraph";
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
    return <svg style={{ display: 'none' }} />
  }
  if (props.curGraph === CONST.GRAPH_TYPE.TREE) {
    drawTreeGraph(props.root);
  }
  if (props.curGraph === CONST.GRAPH_TYPE.TREE_UPDATE) {
    updateTreeGraph(props.root);
  }

  return <svg style={{ display: 'block' }} />;
}


export default Graph;