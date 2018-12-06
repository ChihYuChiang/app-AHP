import React, { Component } from "react";

import DynamicInput from "./dynamic-input";
import Footer from "./footer";
import { Loading, Title } from "./util";

import CONTENT from "../js/content";


class Main extends Component {
  state = {
    isLoading: false
  };

  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div id="head-spacer"></div>
          <Title title="Random" subTitle={CONTENT.SUBTITLE.SIMPLE} />
          <div className="content mt-4">
            <Loading isLoading={this.state.isLoading}/>
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