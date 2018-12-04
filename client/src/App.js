import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainRandom from './component/main_random';


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainAHP} />
            <Route path="/record/:recordId" component={MainAHP} />
            <Route path="/random" component={MainRandom} />
          </Switch>
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}

export default App;
