import React from "react";

import CONTENT from "../js/content";
import CONST from "../js/const";

import { ComponentWTip, Title } from "./util";


function Footer() {
  return (
    <div className="fixed-bottom">
      <div className="footer-control mb-2 ml-3">
        <ComponentWTip
          //TODO: popover instruction with ? icon
          component={
            <a id="a-escapeSimple" href="/simple"><i className="fas fa-sign-out-alt" /></a>
          }
          componentId="a-escapeSimple"
          tipContent={CONTENT.TIP_OTHER.A_ESCAPE_SIMPLE}
          tipPlacement="top"
          tipOffset="0px, 5px"
        />
      </div>
      <div className="footer-band">
        2018<a className="ml-2" href="mailto:chihyuchiang@uchicago.edu">Chih-Yu Chiang</a>
      </div>
    </div>
  );
}


function Header(props) {
  /*
    props = {
      location //AHP or simple
    }
  */
 
  let content = {
    title: "",
    subTitle: ""
  }
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
        title: "Random",
        subTitle: CONTENT.SUBTITLE.SIMPLE
      };     
    }
  }

  return (
    <Title {...content} />
  );
}


export { Header, Footer };