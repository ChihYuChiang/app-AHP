import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import preprocessData from "../js/preData";
import util from "../js/util";
import score from "../js/score";
import { genRoot } from '../js/preData';
import CONST from "../js/const";

import Comparison from "./comparison";
import Graph from "./graph";
import Control from "./control";
//'https://popmotion.io/pose/'
//https://reacttraining.com/react-router/web/api/

import { Loading } from "./util";


class Main extends Component {
  state = {
    option: {
      items: [],
      pairs: [],
      compares: []
    },
    criterion: {
      items: [],
      pairs: {},
      compares: [],
      root: [],
      id2Name: {}
    },
    pairDataGenerator: {},
    curPairData: {},
    curGraph: CONST.GRAPH_TYPE.NULL,
    isLoading: false,
    serverResponse: ''
  };

  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div id="head-spacer"></div>
          <h1>AHP</h1>
          <p className="col-8">{this.state.serverResponse}</p>
          <div className="mt-4">
            <Control
              curGraph={this.state.curGraph}
              renderDemoGraph={() => {this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_DEMO);}}
              recordResult={this.recordResult}
            />
          </div>
          <div className="content mt-4">
            <Loading
              isLoading={this.state.isLoading}/>
            <Graph
              curGraph={this.state.curGraph}
              root={this.state.criterion.root}
              options={this.state.option.items}
            />
            <Comparison
              enterComparison={this.enterComparison}
              handleComData={this.handleComData}
              pairData={this.state.curPairData}
              id2Name={this.state.criterion.id2Name}
              options={this.state.option.items}
            />
          </div>
          <div id="bottom-spacer"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //Render entry graph
    this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_ENTRY);

    //Listen to file input
    const input = document.getElementById("inputCriterionFile");
    input.addEventListener("change", () => {
      readXlsxFile(input.files[0])
        .then(preprocessData)
        .then((data) => { //items, root, pairs, id2Name, generator
          this.setState({
            option: {
              ...this.state.option,
              ...data.option
            },
            criterion: {
              ...this.state.criterion,
              ...data.criterion
            },
            pairDataGenerator: data.pairDataGenerator,
            curPairData: data.pairDataGenerator.next().value,
            curGraph: CONST.GRAPH_TYPE.TREE_UPLOAD //Draw first graph after loaded
          });
        });
    });

    //Test server connection
    this.testApi()
      .then((res) => this.setState({ serverResponse: res.express }))
      .catch((err) => console.log(err));
  }


  handleComData = (comData) => {
    //Accept batch compare data and update App state
    this.setState((state, _) => {
      state[comData.type].compares.push({
        ...comData,
        type: undefined //Remove type property (use undefined would be faster but with potential memory leak)
      });
      state.curPairData = state.pairDataGenerator.next().value; //Gen next pairs

      //If all pairs are displayed, compute score and produce report
      if (util.isEmpty(state.curPairData)) {
        let root = score.embedValue(state.criterion.items, state.option.compares, state.criterion.compares);
        state.criterion.root = root;
        state.curGraph = CONST.GRAPH_TYPE.TREE_UPDATE;
      }
      return state;
    });
  };

  enterComparison = () => {
    this.setState({ curGraph: CONST.GRAPH_TYPE.COMPARISON });
  };

  fetch8RenderGraph = async (graphType) => {
    //Hide graph and display loading spinner
    this.setState({ curGraph: CONST.GRAPH_TYPE.NULL, isLoading: true });

    const response = await fetch('/api/demo');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    this.setState((curState) => {
      //TODO: Clean cur state
  
      curState.option.items = body.items_option;
      curState.criterion.items = body.items_criterion;
      let root = genRoot(body.items_criterion);
      curState.criterion.root = root;
      curState.curGraph = graphType;
  
      curState.isLoading = false;
  
      return curState;
    });
  };

  recordResult = async () => {
    this.setState({ isLoading: true });

    const response = await fetch('/api/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items_criterion: this.state.criterion.items,
        items_option: this.state.option.items,
        compares_criterion: this.state.criterion.compares,
        compares_option: this.state.option.compares
      }),
    });
    const recordId = await response.text();

    this.setState({ isLoading: false });
    return recordId;
  };

  testApi = async () => { //TODO: remove
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
}


export default Main;
