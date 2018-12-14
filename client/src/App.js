import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainSimple from './component/main_simple';

//TODO: redux
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainAHP} />
            <Route path="/record/:recordId" component={MainAHP} />
            <Route path="/simple" component={MainSimple} />
          </Switch>
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}

export default App;
