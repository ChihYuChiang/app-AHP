import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import drawBaseGraph from "./js/drawBaseGraph";
import preprocessData from "./js/preprocessData";

import Pair from "./component/pair";


class App extends Component {
  state = {
    options: [],
    root: []
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>test</h1>
          <div>
            <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
            <label htmlFor="input">Choose a file</label>
          </div>
          <div><svg /></div>
          <div><Pair /></div>
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
        .then((data) => {
          this.setState(data);
          //Draw first graph after loaded
          drawBaseGraph(this.state.root);
        });
    });
  }
}

export default App;
