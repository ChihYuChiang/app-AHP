import React from "react";
import PropTypes from 'prop-types';

import { PosedFadeY } from './pose';

import drawTreeGraph from "../js/treegraph";
import CONST from "../js/const";


function Graph (props) {
  //In React DOM, there's always <svg /> only (no change at all), the d3 code implements on top of that 
  switch (props.curGraph) {
    case CONST.GRAPH_TYPE.NULL:
      return <PosedFadeY id="canvasRoot" style={{ display: "none" }} pose='exit'/>;
    
    default:
      drawTreeGraph(props.root, props.options, props.curGraph);
      return <PosedFadeY id="canvasRoot" style={{ display: "block" }} pose='enter'/>;
  }
}

Graph.propTypes = {
  curGraph: PropTypes.string.isRequired, //The graph to be shown
  root: PropTypes.object.isRequired, //Data for the hierarchical graph
  options: PropTypes.arrayOf(PropTypes.object).isRequired //Aa array of option items
};


export default Graph;