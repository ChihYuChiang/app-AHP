import React from "react";
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFadeY } from './pose';
import CONST from "../js/const";


function Prompt(props) {
  switch (props.curPrompt) {
    default:
    case CONST.PROMPT_TYPE.NULL:
      return <PoseGroup></PoseGroup>
    case CONST.PROMPT_TYPE.DEFAULT:
      return (
        <PoseGroup>
          <PosedFadeY key="prompt">
            <Card className="col-8 border-0" color="light">
              <CardBody>
                <blockquote className="blockquote mb-0 fs-115">
                  <p>{props.prompt.content}</p>
                  <footer className="blockquote-footer">{props.prompt.identity} asks in <cite>a really nice way</cite></footer>
                </blockquote>
              </CardBody>
            </Card>
          </PosedFadeY>
        </PoseGroup>
      );
  }
}

Prompt.propTypes = {
  curPrompt: PropTypes.string.isRequired,
  prompt: PropTypes.exact({
    content: PropTypes.string, //Current prompt to be displayed
    identity: PropTypes.string
  }).isRequired
};


export default Prompt;