import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainSimple from './component/main_simple';

import CONST from './js/const';


//TODO: redux
//TODO: logging fluentd logging layer lightsail after ML app
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path={CONST.LOCATION.AHP} component={MainAHP} />
          <Route path="/home" render={
            //This setting make it refresh when from "/" to "/"
            () => <Redirect to={CONST.LOCATION.AHP}/>
          }/>
          <Route path="/record/:recordId" component={MainAHP} />
          <Route path={CONST.LOCATION.SIMPLE} component={MainSimple} />
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}


export default App;