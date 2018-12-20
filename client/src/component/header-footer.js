import React, { Component } from "react";
import PropTypes from 'prop-types';

import CONTENT from "../js/content";
import CONST from "../js/const";

import { ComponentWTip, Title } from "./util";


//TODO: menu
function Header(props) {
  let content = {
    title: "",
    subTitle: ""
  };

  switch (props.location) {
    default:
    case CONST.LOCATION.AHP: {
      content = {
        title: "AHP",
        subTitle: CONTENT.SUBTITLE.AHP
      };
      break;
    }
    case CONST.LOCATION.SIMPLE: {
      content = {
        title: "Simple",
        subTitle: CONTENT.SUBTITLE.SIMPLE
      };     
    }
  }

  return (
    <Title {...content} />
  );
}

Header.propTypes = {
  location: PropTypes.string.isRequired //AHP or simple
};


//TODO: when mobile, footer not sticky
class Footer extends Component {
  state = {
    version: ""
  };

  render() {
    let controls = {};
    switch (this.props.location) {
      default:
      case CONST.LOCATION.AHP:
        controls = (
          <ComponentWTip
            component={
              <a id="a-escapeSimple" href="/simple"><i className="fas fa-sign-out-alt" /></a>
            }
            tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
            tippyConfig={{
              placement: "top",
              offset: "0px, 5px"
            }}
          />
        );
        break;
  
      case CONST.LOCATION.SIMPLE:
        controls = <div />
    }

    let versionInfo = this.state.version ? "Version " + this.state.version : "";

    return (
      <div id="footer-wrapper" className="fixed-bottom">
        <div className="footer-control d-flex mb-2">
          {controls}
          <span className="ml-auto align-self-end">{versionInfo}</span>
        </div>
        <div className="footer-band d-flex">
          <span className="ml-auto">
            2018<a className="ml-2" href="mailto:chihyuchiang@uchicago.edu">Chih-Yu Chiang</a>
          </span>
        </div>
      </div>
    );
  }

  componentDidMount() {
    fetch('/info')
      .then((response) => {
        return response.text(); //It's a promise resolved when finished streaming text
      })
      .then((resText) => {
        this.setState({
          version: resText
        });
      });
  }
}

Footer.propTypes = {
  location: PropTypes.string.isRequired //AHP or simple
};


export { Header, Footer };