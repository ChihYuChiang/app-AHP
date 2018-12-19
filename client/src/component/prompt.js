import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, CardText } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFadeY } from './pose';
import { ComponentWTip } from './util';

import CONST from "../js/const";


function Prompt(props) {
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

  switch (props.curPrompt) {
    default:
    case CONST.PROMPT_TYPE.NULL:
      return <PoseGroup></PoseGroup>
    case CONST.PROMPT_TYPE.REPORT:
    case CONST.PROMPT_TYPE.DEFAULT:
      return (
        <PoseGroup>
          <PosedFadeY key="prompt">
            <ComponentWTip
              component={prompt}
              tipContent="The decision to be made. This one is a sample."
              tippyConfig={{
                placement: "bottom",
                offset: "40px"
              }}
            />
          </PosedFadeY>
        </PoseGroup>
      );
  }
}

Prompt.propTypes = {
  curPrompt: PropTypes.string.isRequired,
  prompt: PropTypes.string.isRequired //Current prompt to be displayed
};


export default Prompt;