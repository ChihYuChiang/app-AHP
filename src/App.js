import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import drawTreeGraph, { updateTreeGraph } from "./js/treeGraph";
import preprocessData from "./js/preData";
import util from "./js/util";
import score from "./js/score";

import Comparison from "./component/comparison";


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
    curPairData: {}
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>AHP</h1>
          <div>
            <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
            <label htmlFor="input">Choose a file</label>
          </div>
          <div><svg /></div>
          <Comparison
            handleComData={this.handleComData}
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
            curPairData: data.pairDataGenerator.next().value
          });
          //Draw first graph after loaded
          drawTreeGraph(this.state.criterion.root);
        });
    });
  }

  handleComData = (comData) => {
    this.setState((state, _) => {
      state[comData.type].compares.push({
        ...comData,
        type: undefined //Remove type property (use undefined would be faster but with potential memory leak)
      });
      state.curPairData = state.pairDataGenerator.next().value;

      return state;
    }, () => {
      if (util.isEmpty(this.state.curPairData)) {
        this.updateRootWCom();
        this.forceUpdate(() => { //Element is controlled by React and will not re-render without the data binding, need forceUpdate
          updateTreeGraph(this.state.criterion.root);
        });
      }
    });
    
  }

  updateRootWCom = () => {
    this.setState((state, _) => {
      let root = score.embedValue(state.criterion.items, state.option.compares, state.criterion.compares);

      return {
        criterion: {
          ...state.criterion,
          root: root
        }
      };
    });
  }
}

export default App;
