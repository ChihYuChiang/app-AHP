import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { PoseGroup } from 'react-pose';

import { PosedFadeY } from './pose';
import { ButtonWTip, ComponentWTipFb } from "./util";
import Instruction from "./instruction";

import CONST from "../js/const";
import CONTENT from "../js/content";


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
          <div>
            <ButtonToolbar id="control-wrapper" className="justify-content-center">
              {this.state.recordUrl || !this.props.isRevised ?
              <ButtonWTip className="disabled"
                buttonContent="Revise Assessment"
                tipContent={CONTENT.TIP_BTN.EVALUATE_AGAIN}
              /> :
              <ButtonWTip
                buttonContent="Save Your Report"
                buttonOnClick={this.record8GetUrl}
                tipContent={CONTENT.TIP_BTN.RECORD_REPORT}
              />
              }
              <Button className="ml-2 mr-2">
                <Link to="/home">Make New Decision</Link>
              </Button>
              <Instruction
                className="align-self-center"
                freshman={this.props.freshman}
                becomeOld={this.props.becomeOld}
              />
            </ButtonToolbar>
            <PoseGroup>
              {this.props.curControl === CONST.CONTROL_TYPE.UPDATE ?
              false :
              <PosedFadeY key="reportUrl">
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
              </PosedFadeY>}
            </PoseGroup>
          </div>
        );

      case CONST.CONTROL_TYPE.DEFAULT:
      default:
        return (
          <div id="control-wrapper">
            <input
              className="file-input"
              id="fileInput-criteria"
              type="file"
              accept=".xlsx"
              onChange={(evt) => {this.props.handleCriterionFile(evt.target.files[0]);}}
            />
            <ButtonToolbar className="justify-content-center">
              <ButtonWTip
                className="mr-2"
                buttonContent="Demo Result"
                buttonOnClick={this.props.renderDemoGraph}
                tipContent={CONTENT.TIP_BTN.DEMO_RESULT}
              />
              <ButtonWTip
                className="btnGroup-left"
                buttonContent={
                  <a href={`${CONST.PATH.TEMPLATE_SERVER}/api/template`} download>
                    Download Template
                  </a>
                }
                tipContent={CONTENT.TIP_BTN.DOWNLOAD_TEMPLATE}>
              </ButtonWTip>
              <ButtonWTip
                className="btnGroup-right mr-2"
                buttonContent={
                  <label htmlFor="fileInput-criteria" className="file-label">
                    Upload Your Criteria
                  </label>
                }
                tipContent={CONTENT.TIP_BTN.UPLOAD_CRITERIA}>
              </ButtonWTip>
              <Instruction
                className="align-self-center"
                freshman={this.props.freshman}
                becomeOld={this.props.becomeOld}
              />
            </ButtonToolbar>
          </div>
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
  isRevised: PropTypes.string.isRequired, //Let recording record only when revised (enter report through comparison)
  handleCriterionFile: PropTypes.func.isRequired, //Deliver the uploaded criterion file to be handled by main
  renderDemoGraph: PropTypes.func.isRequired,
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