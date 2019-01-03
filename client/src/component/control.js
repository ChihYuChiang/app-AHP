import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { PoseGroup } from 'react-pose';

import { PosedFade } from './pose';
import { ButtonWTip, ComponentWTip, ComponentWTipFb } from "./util";
import Instruction from "./instruction";

import CONST from "../share/const";
import MEASURE from "../share/measure";
import CONTENT from "../share/content";


//TODO: share social media
class Control extends Component {
  state = {
    recordUrl: "" //Set when the user record the result
  };

  render() {
    switch (this.props.curControl) {
      
      case CONST.CONTROL_TYPE.NULL:
        return <div id="control-wrapper"/>;

      case CONST.CONTROL_TYPE.UPDATE:
      case CONST.CONTROL_TYPE.RECORDED:
        return (
          <PoseGroup animateOnMount={true}>
            <PosedFade key="btnToolBar" cDelay={MEASURE.POSE_DELAY.PHASE_0}>
              <ButtonToolbar id="control-wrapper" className="justify-content-center">
                {this.props.isRevised ?
                <ButtonWTip
                  buttonContent="Save Your Report"
                  buttonOnClick={this.record8GetUrl}
                  tipContent={CONTENT.TIP_BTN.RECORD_REPORT}
                /> :            
                <ButtonWTip
                  buttonContent="Revise Assessment"
                  buttonOnClick={this.props.renderReviseGraph}
                  tipContent={CONTENT.TIP_BTN.EVALUATE_AGAIN}
                />}
                <Link to="/home">
                  <Button className="ml-2 mr-2">
                    Make New Decision
                  </Button>
                </Link>
                <Instruction
                  className="align-self-center"
                  freshman={this.props.freshman}
                  becomeOld={this.props.becomeOld}
                />
              </ButtonToolbar>
            </PosedFade>
            {this.props.curControl === CONST.CONTROL_TYPE.UPDATE ?
            false :
            <PosedFade key="reportUrl" cDelay={MEASURE.POSE_DELAY.PHASE_0}>
              <div className="col-8 mt-4 mb-5">
                <Label for="recordUrl">Click to copy report URL</Label >
                <ComponentWTipFb tipContent="Copied">
                  <Input type="text" id="recordUrl" readOnly
                    onClick={copyRecordUrl}
                    value={this.state.recordUrl}
                  />
                </ComponentWTipFb>
                <div className="info-text pt-2">{CONTENT.INSTRUCTION.SUBJECT2CHANGE}</div>
              </div>
            </PosedFade>}
          </PoseGroup>
        );

      case CONST.CONTROL_TYPE.DEFAULT:
      default:
        return (
          //TODO: FA for all buttons
          <PoseGroup animateOnMount={true}>
            <PosedFade key="btnToolBar" cDelay={MEASURE.POSE_DELAY.PHASE_0 + MEASURE.POSE_DELAY.LANDING}>
              <input key="input"
                className="file-input"
                id="fileInput-criteria"
                type="file"
                accept=".xlsx"
                onChange={(evt) => {this.props.handleCriterionFile(evt.target.files[0]);}}
              />
              <ButtonToolbar id="control-wrapper" className="justify-content-center">
                <ButtonWTip
                  className="mr-2"
                  buttonContent="Demo Result"
                  buttonOnClick={this.props.renderDemoGraph}
                  tipContent={CONTENT.TIP_BTN.DEMO_RESULT}
                />
                <a href={`${CONST.PATH.TEMPLATE_SERVER}/api/template`} download>
                  <ButtonWTip
                  //Make a wrapping btn instead of inside btn to make works in Firefox
                    className="btnGroup-left"
                    buttonContent="Download Template"
                    tipContent={CONTENT.TIP_BTN.DOWNLOAD_TEMPLATE}>
                  </ButtonWTip>
                </a>
                <ComponentWTip
                  tipContent={CONTENT.TIP_BTN.UPLOAD_CRITERIA}
                  tippyConfig={{ offset: "40px, 5px" }}>
                  <label htmlFor="fileInput-criteria" className="btn btn-secondary btnGroup-right mr-2">
                    Upload Your Criteria
                  </label>
                </ComponentWTip>
                <Instruction
                  className="align-self-center"
                  freshman={this.props.freshman}
                  becomeOld={this.props.becomeOld}
                />
              </ButtonToolbar>
            </PosedFade>
          </PoseGroup>
        );
    }
  }


  record8GetUrl = async () => {
    let recordUrl = await this.props.recordResult();
    this.setState({ recordUrl: recordUrl });
  };
}

Control.propTypes = {
  curControl: PropTypes.string.isRequired, //App state marker
  isRevised: PropTypes.bool.isRequired, //Let recording record only when revised (enter report through comparison)
  handleCriterionFile: PropTypes.func.isRequired, //Deliver the uploaded criterion file to be handled by main
  renderDemoGraph: PropTypes.func.isRequired,
  renderReviseGraph: PropTypes.func.isRequired,
  recordResult: PropTypes.func.isRequired, //Record to db the current comparison data
  freshman: PropTypes.bool.isRequired, //To be used in `Instruction`
  becomeOld: PropTypes.func.isRequired //Set freshman to `false`
};


//Copy the url into clipboard when clicking the element
function copyRecordUrl() {
  let urlElement = document.getElementById("recordUrl");
  urlElement.select(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
  document.execCommand("copy");
}


export default Control;