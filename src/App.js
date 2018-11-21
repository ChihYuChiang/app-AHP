import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import drawBaseGraph from "./js/drawBaseGraph";
import preprocessData from "./js/preprocessData";

import Comparison from "./component/comparison";


class App extends Component {
  state = {
    option: {
      items: [],
      pairs: [],
      compares: []
    },
    criterion: {
      root: [],
      pairs: {},
      curPairs: 0,
      compares: {}
    }
  };

  render() {
    let [gId, pairs] = Object.entries(this.state.criterion.pairs)[this.state.criterion.curPairs] || [undefined, undefined];

    return (
      <div className="App">
        <div className="container">
          <h1>test</h1>
          <div>
            <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
            <label htmlFor="input">Choose a file</label>
          </div>
          <div><svg /></div>
          <div><Comparison handleComData={this.handleComData} pairs={pairs} gId={gId} /></div>
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
        .then((data) => { //item/root pairs
          this.setState({
            option: {
              ...this.state.option,
              ...data.option
            },
            criterion: {
              ...this.state.criterion,
              ...data.criterion
            }
          });
          //Draw first graph after loaded
          drawBaseGraph(this.state.criterion.root);
        });
    });
  }

  handleComData = (comData) => {
    this.setState({
      criterion: {
        ...this.state.criterion,
        compares: comData,
        curPairs: this.state.criterion.curPairs + 1
      }
    });
  }
}

export default App;
