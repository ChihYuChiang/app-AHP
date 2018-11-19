import React, { Component } from "react";
import readXlsxFile from "read-excel-file";
import * as d3 from "d3";

import drawBaseGraph from "./js/drawBaseGraph";

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
    this.listen2Data();
  }

  listen2Data = () => {
    const input = document.getElementById("input");
  
    input.addEventListener("change", () => {
      readXlsxFile(input.files[0]).then(rows => {
        const nRow = rows.length;
        const nCol = rows[0].length;

        //Get options
        let options = [];
        for (let i = 1; rows[i][0]; i++) {
          options.push(rows[i][0]);
        }

        //Get hierarchy data
        function searchParent(i, j) {
          return j === 1 ? "root" : rows[i][j - 1] || searchParent(i - 1, j);
        }
        let data = [{ name: "root", parent: "" }];
        for (let i = 1; i < nRow; i++) {
          for (let j = nCol - 1; j > 0; j--) {
            if (rows[i][j]) {
              data.push({
                name: rows[i][j],
                parent: searchParent(i, j)
              });
            }
          }
        }
        let root = d3
          .stratify()
          .id(function(d) {
            return d.name;
          })
          .parentId(function(d) {
            return d.parent;
          })(data);
        console.log(root);
  
        //Identify graph boundary
        root.dx = 30;
        root.dy = 500 / (root.height + 1);
        let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
        treeLayout(root);
        
        this.setState({
          options: options,
          root: root
        });

        //Draw first graph after loaded
        drawBaseGraph(this.state.root);
      });
    });
  }
}

export default App;
