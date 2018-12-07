import React, { Component } from "react";

import DynamicInput from "./dynamic-input";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";

import CONST from "../js/const";


class Main extends Component {
  state = {
    isLoading: false
  };

  //TODO: shuffle current options
  //TODO: mysterious keyword
  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div className="spacer-100"></div>
          <Header location={CONST.LOCATION.SIMPLE} />
          <div className="content mt-4">
            <Loading isLoading={this.state.isLoading}/>
          </div>
          <DynamicInput />
          <Footer />
          <div className="spacer-100"></div>
        </div>
      </div>
    );
  }
}


export default Main;