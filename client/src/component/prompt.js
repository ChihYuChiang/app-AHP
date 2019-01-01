import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFadeY, PosedNull } from './pose';
import { ComponentWTip } from './util';

import CONST from "../share/const";
import MEASURE from "../share/measure";
import CONTENT from "../share/content";


function Prompt(props) {
  let promptContent;
  let adj2 = (['a', 'e', 'i', 'o', 'u'].includes(props.prompt.adjs[1][0]) ? "an " : "a ") + props.prompt.adjs[1]; //Add a proper determinant
  let prompt = (
    <Card className="mt-4 decision-prompt">
      <CardBody>
        <CardText>{props.prompt.text}</CardText>
        <CardText className="blockquote-footer">
          Someone {props.prompt.adjs[0]} asked in <cite>{adj2} way</cite>
        </CardText>
      </CardBody>
    </Card>
  );
  let withTip = (tipContent) => (
    <PosedFadeY key="prompt" cDelay={MEASURE.POSE_DELAY.PHASE_1}>
      <ComponentWTip
        tipContent={tipContent}
        tippyConfig={{
          placement: "bottom",
          offset: "40px"
        }}>
        {prompt}
      </ComponentWTip>
    </PosedFadeY>
  );

  switch (props.curPrompt) {
    default:
    case CONST.PROMPT_TYPE.NULL: //Empty
      promptContent = false;
      break;

    case CONST.PROMPT_TYPE.UPLOAD:
      promptContent = (
        <PosedNull key="prompt">
          <PosedFadeY cDelay={MEASURE.POSE_DELAY.PHASE_0}>
            <div className="col-8 fs-115">
              Please review and confirm the following information and criteria hierarchy are correct.
            </div>
          </PosedFadeY>
          <PosedFadeY cDelay={MEASURE.POSE_DELAY.PHASE_2}>
            {prompt}
          </PosedFadeY>
        </PosedNull>
      );
      break;
    
    case CONST.PROMPT_TYPE.REPORT_PRE:
      promptContent = (
        <PosedNull key="prompt">
          <PosedFadeY cDelay={MEASURE.POSE_DELAY.PHASE_0}>
            <div className="col-8 fs-115">
              Decision and criteria retrieved.
            </div>
          </PosedFadeY>
          <PosedFadeY cDelay={MEASURE.POSE_DELAY.PHASE_2}>
            {prompt}
          </PosedFadeY>
        </PosedNull>
      );
      break;    

    case CONST.PROMPT_TYPE.REPORT: //No tip
      promptContent = (
        <PosedFadeY key="prompt" cDelay={MEASURE.POSE_DELAY.PHASE_2}>
          {prompt}
        </PosedFadeY>
      );
      break;
      
    case CONST.PROMPT_TYPE.DEMO: //With tip
      promptContent = withTip(CONTENT.TIP_OTHER.CARD_PROMPT_DEMO);
      break;
    case CONST.PROMPT_TYPE.ENTRY:
      promptContent = withTip(CONTENT.TIP_OTHER.CARD_PROMPT_ENTRY);
  }

  return <PoseGroup>{promptContent}</PoseGroup>;
}

Prompt.propTypes = {
  curPrompt: PropTypes.string.isRequired,
  prompt: PropTypes.exact({
    text: PropTypes.string, //Current prompt to be displayed
    adjs: PropTypes.arrayOf(PropTypes.string) //Adjs used in signature
  })
};


export default Prompt;