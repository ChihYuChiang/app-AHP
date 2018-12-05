import React, { Component } from "react";

import DynamicInput from "./dynamic-input";
import Footer from "./footer";
import { Loading } from "./util";


class Main extends Component {
  state = {
    isLoading: false
  };

  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div id="head-spacer"></div>
          <h1>Random</h1>
          <p className="col-8">This is a random decision maker. It makes life much easier.</p>
          <div className="content mt-4">
            <Loading
              isLoading={this.state.isLoading}/>
          </div>
          <DynamicInput />
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