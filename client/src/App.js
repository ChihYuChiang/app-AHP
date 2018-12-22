import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainSimple from './component/main_simple';

//TODO: redux
//TODO: logging fluentd logging layer lightsail after ML app
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainAHP} />
            <Route exact path="/home" render={
              //This setting make it refresh when from "/" to "/"
              () => <Redirect to="/"/>
            }/>
            <Route path="/record/:recordId" component={MainAHP} />
            <Route path="/simple" component={MainSimple} />
          </Switch>
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}

export default App;
