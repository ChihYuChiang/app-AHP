import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFadeY } from './pose';
import { ComponentWTip } from './util';

import CONST from "../js/const";
import CONTENT from "../js/content";


function Prompt(props) {
  let promptContent;
  let prompt = (
    <Card id="prompt" className="mt-4">
      <CardBody>
        <CardText>{props.prompt}</CardText>
        <CardText className="blockquote-footer">
          Someone famous asked in <cite>a nice way</cite>
        </CardText>
      </CardBody>
    </Card>
  );
  let withTip = (tipContent) => (
    <PosedFadeY key="prompt">
      <ComponentWTip
        component={prompt}
        tipContent={tipContent}
        tippyConfig={{
          placement: "bottom",
          offset: "40px"
        }}
      />
    </PosedFadeY>
  );

  switch (props.curPrompt) {
    default:
    case CONST.PROMPT_TYPE.NULL: //Empty
      promptContent = false;
      break;

    case CONST.PROMPT_TYPE.UPLOAD: //No tip
    case CONST.PROMPT_TYPE.REPORT:
      promptContent = (
        <PosedFadeY key="prompt">
          {prompt}
        </PosedFadeY>
      );
      break;
      
    case CONST.PROMPT_TYPE.DEMO: //With tip
      promptContent = withTip(CONTENT.TIP_OTHER.CARD_PROMPT_DEMO); break;
    case CONST.PROMPT_TYPE.ENTRY:
      promptContent = withTip(CONTENT.TIP_OTHER.CARD_PROMPT_ENTRY);
  }

  return <PoseGroup>{promptContent}</PoseGroup>;
}

Prompt.propTypes = {
  curPrompt: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired //Current prompt to be displayed
};


export default Prompt;