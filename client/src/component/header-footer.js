import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";


import CONTENT from "../js/content";
import CONST from "../js/const";

import { ComponentWTip, ComponentWTipCf, Title } from "./util";


//TODO: menu
class Header extends Component {
  render() {
    let content = {
      title: "",
      subTitle: ""
    };
  
    switch (this.props.location.pathname) {
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
      <div>
        <div className="spacer-100"></div>
        <Title {...content} />
      </div>
    );
  }
}

Header = withRouter(Header); //Acquire location info


//TODO: when mobile, footer not sticky
class Footer extends Component {
  state = {
    version: "",
  };

  //[CONST.COM_TYPE.COMPARISON, CONST.COM_TYPE.CONFIRM_POST].includes(curComparison)

  render() {
    let controls = {};
    switch (this.props.location.pathname) {
      default:
      case CONST.LOCATION.AHP:
        controls = (
          <div className="d-inline-flex">
            <ComponentWTip
              component={<Link to="/simple"><i className="fas fa-sign-out-alt" /></Link>}
              tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
              tippyConfig={{
                placement: "top",
                offset: "0px, 5px"
              }}
            />
            <ComponentWTipCf
              //Imperative routing https://tylermcginnis.com/react-router-programmatically-navigate/
              action={() => this.props.history.push('/home')}
              component={<i className="fas fa-home pl-3" />}
              tipContent={<div>Progress you made will <b>not</b> be saved.<br />Proceed anyway?</div>}
            />
          </div>
        );
        break;
  
      case CONST.LOCATION.SIMPLE:
        controls = (
          <div classNAme="d-inline-flex">
            <Link to="/"><i className="fas fa-home" /></Link>
          </div>
        );
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

Footer = withRouter(Footer);
Footer.propTypes = {
  curComparison: PropTypes.string.isRequired //Used to decide if pop confirms when clicking routing icons
};


export { Header, Footer };