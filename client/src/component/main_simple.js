import React, { Component } from "react";

import CONST from "../js/const";

import Control from "./control";
import Footer from "./footer";
import { Loading } from "./util";


class Main extends Component {
  state = {
    curControl: CONST.CONTROL_TYPE.NULL,
    isLoading: false
  };

  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div id="head-spacer"></div>
          <h1>Random</h1>
          <p className="col-8">This is a random decision maker. It makes life much easier.</p>
          <div className="mt-4">
            <Control
              curControl={this.state.curControl}
            />
          </div>
          <div className="content mt-4">
            <Loading
              isLoading={this.state.isLoading}/>
          </div>
          <div className="fixed-bottom">
            <Footer />
          </div>
          <div id="bottom-spacer"></div>
        </div>
      </div>
    );
  }
}


export default Main;