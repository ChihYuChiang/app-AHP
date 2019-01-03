import React from "react";
import { withRouter } from "react-router-dom";
import { PoseGroup } from 'react-pose';

import { PosedFade } from './pose';

import CONTENT from "../share/content";
import CONST from "../share/const";
import MEASURE from "../share/measure";


function Title(props) {
  let title, cDelay_subTitle;
  let content = {
    title: "",
    subTitle: ""
  };

  switch (props.location.pathname) {
    default:
    case CONST.LOCATION.AHP: {
      cDelay_subTitle = MEASURE.POSE_DELAY.PHASE_0 + MEASURE.POSE_DELAY.LANDING;
      content = {
        title: "Hierarch",
        subTitle: CONTENT.SUBTITLE.AHP
      };
      title = (
        <h1 className="title-AHP">
          <span className="title-AHP-static">{content.title + "ic"}</span>

          <div className="title-AHP-animated">
            <span>{content.title}</span>
            <ul className="title-AHP-animated__carousel">
              <li>
                <span className="invisible mr-2">Analytical </span>
                <span className="invisible">{content.title}</span>
                <span>ic</span>
                <span className="invisible ml-2">Process</span>
              </li>            
              <li>
                <span className="mr-2">Analytical </span>
                <span className="invisible">{content.title}</span>
                <span>y </span>
                <span className="ml-2">Process</span>
              </li>
            </ul>
          </div>
        </h1>
      );
      break;
    }

    case CONST.LOCATION.SIMPLE: {
      cDelay_subTitle = MEASURE.POSE_DELAY.PHASE_0;
      content = {
        title: "Simple",
        subTitle: CONTENT.SUBTITLE.SIMPLE
      };
      title = (
        <h1 className="title-simple">
          {content.title}
        </h1>
      );
    }
  }

  return (
    <PoseGroup animateOnMount={true}>
      <PosedFade key={"title_" + content.title} cDelay={MEASURE.POSE_DELAY.PHASE_0}>
        {title}
      </PosedFade>
      <PosedFade key={"subTitle_" + content.title} cDelay={cDelay_subTitle}>
        <div className="col-8 mt-4">{content.subTitle}</div>
      </PosedFade>
    </PoseGroup>
  );
}

//eslint-disable-next-line
Title = withRouter(Title); //Acquire location info


export default Title;