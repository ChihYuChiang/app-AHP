import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Main from './component/main';


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
