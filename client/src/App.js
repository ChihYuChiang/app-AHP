import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import MainAHP from './component/main_AHP';
import MainSimple from './component/main_simple';
import { Header, Footer } from "./component/header-footer";


//TODO: redux
//TODO: logging fluentd logging layer lightsail after ML app
//TODO: remove header footer and put outside the routes
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="container" align="center">
            <Header />
            
            <Route exact path="/" component={MainAHP} />
            <Route path="/home" render={
              //This setting make it refresh when from "/" to "/"
              () => <Redirect to="/"/>
            }/>
            <Route path="/record/:recordId" component={MainAHP} />
            <Route path="/simple" component={MainSimple} />
            
            <Footer />
          </div>
        </div>
      </BrowserRouter> //TODO: deal with 404
    );
  }
}

export default App;
