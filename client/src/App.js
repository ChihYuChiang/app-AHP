import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainSimple from './component/main_simple';

import CONST from './share/const';


//TODO: redux ML app
//TODO: logging fluentd logging layer lightsail after ML app
//TODO: OAuth log in and personal decision record
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
      </BrowserRouter>
    );
  }
}


export default App;