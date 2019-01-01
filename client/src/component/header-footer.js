import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";

import { ComponentWTip, ComponentWTipCf, Title } from "./util";

import CONTENT from "../share/content";
import CONST from "../share/const";


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
          title: "Hierarchic",
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
        <div className="fixed-top">
          <div className="footer-control d-flex mt-3">
            <span className="ml-auto mr-2 mt-1 d-inline-block no-pointer">{greetByTime()}</span>
            <i className="fas fa-user-circle remove-focus-effect" />
          </div>
        </div>
        <div className="spacer-100"></div>
        <Title {...content} />
      </div>
    );
  }


  logIn = () => {
    //TODO: OAuth implementation
  };

  logOff = () => {

  };
}

Header = withRouter(Header); //Acquire location info


//TODO: when mobile, footer not sticky
class Footer extends Component {
  state = {
    version: "",
    cfTipVisible: false
  };

  render() {
    let controls = {};
    switch (this.props.location.pathname) {
      default:
      case CONST.LOCATION.AHP: //When comparing, give confirm if trying to leave
        if ([CONST.COM_TYPE.COMPARISON, CONST.COM_TYPE.CONFIRM_POST].includes(this.props.curComparison)) {
          let confirmMsg = <div>Progress you made will <b>not</b> be saved.<br />Proceed anyway?</div>;
          controls = (
            <div className="d-inline-flex">
              <ComponentWTipCf trigger="manual" isVisible={this.state.cfTipVisible} toggleVisible={this.toggleCfTip}
                action={() => this.props.history.push('/simple')}
                tipContent={confirmMsg}>
                <div className="anchor" />
              </ComponentWTipCf>
              <ComponentWTip
                //Add <span> to maintain the height as in other conditions with <a>
                tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
                tippyConfig={{
                  placement: "top",
                  offset: "0px, 5px"
                }}>
                <span className="remove-focus-effect"><i className="fas fa-sign-out-alt" onClick={this.toggleCfTip} /></span>
              </ComponentWTip>
              <ComponentWTipCf
                //Imperative routing https://tylermcginnis.com/react-router-programmatically-navigate/
                action={() => this.props.history.push('/home')}
                tipContent={confirmMsg}>
                <span className="remove-focus-effect"><i className="fas fa-home pl-3" /></span>
              </ComponentWTipCf>
            </div>
          );
        } else {
          controls = (
            <div className="d-inline-flex">
              <ComponentWTip
                tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
                tippyConfig={{
                  placement: "top",
                  offset: "0px, 5px"
                }}>
                <Link to="/simple"><i className="fas fa-sign-out-alt" /></Link>
              </ComponentWTip>
              <Link to="/home"><i className="fas fa-home pl-3" /></Link>
            </div>
          );
        }
        break;
  
      case CONST.LOCATION.SIMPLE:
        controls = (
          <div className="d-inline-flex">
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


  toggleCfTip = () => {
    this.setState({ cfTipVisible: !this.state.cfTipVisible })
  };
}

Footer = withRouter(Footer);
Footer.propTypes = {
  curComparison: PropTypes.string //Used to decide if pop confirms when clicking routing icons
};


function greetByTime() {
  let curDate = new Date();

  let prefix = CONTENT.GREETING_PREFIX[curDate.getDate() % CONTENT.GREETING_PREFIX.length];
  
  let timeLiteral;
  switch (parseInt(curDate.getHours() / 4)) {
    default: timeLiteral = "day"; break;

    case 1: //4-11
    case 2: timeLiteral = "morning"; break;

    case 3: //12-19
    case 4: timeLiteral = "afternoon"; break;

    case 0: //20-3
    case 5: timeLiteral = "evening";
  }

  return prefix + " " + timeLiteral;
}


export { Header, Footer };