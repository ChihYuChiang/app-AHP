import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Main from './component/main';


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/record/:recordId" component={Main} />
          </Switch>
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}

export default App;
