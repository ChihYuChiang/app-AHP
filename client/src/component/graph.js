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
    return <div id="canvasRoot"><svg style={{ display: 'none' }} /></div>;
  }
  if ([CONST.GRAPH_TYPE.TREE, CONST.GRAPH_TYPE.TREE_DEMO].includes(props.curGraph)) {
    drawTreeGraph(props.root, props.options);
  }
  if (props.curGraph === CONST.GRAPH_TYPE.TREE_UPDATE) {
    drawTreeGraph(props.root, props.options);
  }

  return <div id="canvasRoot"><svg style={{ display: 'block' }} /></div>;
}


export default Graph;