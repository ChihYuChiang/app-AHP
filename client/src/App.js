import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import preprocessData from "./js/preData";
import util from "./js/util";
import score from "./js/score";
import CONST from "./js/const";

import Comparison from "./component/comparison";
import Graph from "./component/graph";
import Control from "./component/control";


class App extends Component {
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
    curGraph: null,
    serverResponse: ''
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>AHP</h1>
          <p className="dev">{this.state.serverResponse}</p>
          <Control />
          <Graph
            curGraph={this.state.curGraph}
            root={this.state.criterion.root}
            options={this.state.option.items}
          />
          <Comparison
            handleComData={this.handleComData}
            hideGraph={this.hideGraph}
            pairData={this.state.curPairData}
            id2Name={this.state.criterion.id2Name}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const input = document.getElementById("input");
    
    //Listen to file input
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
            curGraph: CONST.GRAPH_TYPE.TREE //Draw first graph after loaded
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

        this.recordResult(state);
      }
      return state;
    });
  };

  hideGraph = () => {
    this.setState({ curGraph: null });
  };

  recordResult = async (state) => {
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items_criterion: state.criterion.items,
        items_option: state.option.items,
        compares_criterion: state.criterion.compares,
        compares_option: state.option.compares
      }),
    });
    const body = await response.text();
    console.log(body);
  };

  testApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
}


export default App;
