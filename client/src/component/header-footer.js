import React from "react";
import PropTypes from 'prop-types';

import CONTENT from "../js/content";
import CONST from "../js/const";

import { ComponentWTip, Title } from "./util";


//TODO: when mobile, footer not sticky
function Footer(props) {
  let controls = {};
  switch (props.location) {
    default:
    case CONST.LOCATION.AHP:
      controls = (
        <ComponentWTip
          component={
            <a id="a-escapeSimple" href="/simple"><i className="fas fa-sign-out-alt" /></a>
          }
          componentId="a-escapeSimple"
          tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
          tipPlacement="top"
          tipOffset="0px, 5px"
        />
      );
      break;

    case CONST.LOCATION.SIMPLE:
      controls = <div />
  }

  return (
    <div id="footer-wrapper" className="fixed-bottom">
      <div className="footer-control mb-2 ml-3">
        {controls}
      </div>
      <div className="footer-band">
        2018<a className="ml-2" href="mailto:chihyuchiang@uchicago.edu">Chih-Yu Chiang</a>
      </div>
    </div>
  );
}

Footer.propTypes = {
  location: PropTypes.string.isRequired //AHP or simple
};


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


export { Header, Footer };