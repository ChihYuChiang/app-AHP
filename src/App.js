import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import drawBaseGraph from "./js/drawBaseGraph";
import preprocessData from "./js/preprocessData";

import Comparison from "./component/comparison";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: {
        items: [],
        pairs: [],
        compares: []
      },
      criterion: {
        root: [],
        pairs: {},
        compares: {},
        id2Name: {}
      },
      pairsGenerator: {},
      curPairData: {}
    };
  }

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
        .then((data) => { //item/root, pairs, id2Name, generator
          this.setState({
            option: {
              ...this.state.option,
              ...data.option
            },
            criterion: {
              ...this.state.criterion,
              ...data.criterion
            },
            pairsGenerator: data.pairsGenerator,
            curPairData: data.pairsGenerator.next().value
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
      },
      curPairData: this.state.pairsGenerator.next().value
    });
  }
}

export default App;
