import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import preprocessData from "./js/preData";
import util from "./js/util";
import score from "./js/score";
import CONST from "./js/const";

import Comparison from "./component/comparison";
import Graph from "./component/graph";
import FileInput from "./component/fileInput";


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
          <FileInput />
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
    this.callApi()
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
  }

  hideGraph = () => {
    this.setState({ curGraph: null });
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
}


export default App;
