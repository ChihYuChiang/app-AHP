import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import CONST from "../js/const";


function Control(props) {
  /*
    props = {
      getDemoData //Get from db the specified data for demo
      recordResult //Record to db the current comparison data
    }
  */
  return (
    <div>
      <input type="file" id="inputCriterionFile" accept=".xlsx" className="file-input"/>
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group" role="group">
          <Button><label htmlFor="inputCriterionFile" className="file-label">Choose a File</label></Button>
          <Button><a href={`${CONST.PATH.TEMPLATE_SERVER}/api/template`} download>Download Template</a></Button>
          <Button onClick={props.getDemoData}>Demo</Button>
        </div>
        <div className="btn-group" role="group">
          <Button onClick={props.recordResult}>Record Result</Button>
        </div>
      </div>

      <FormGroup controlId="recordUrl">
        <ControlLabel>Click to copy</ControlLabel>
        <FormControl type="text" readOnly
          onClick={copyRecordUrl}
          value={"this is the url for your record"}
        />
      </FormGroup>
    </div>
  );
}


//Copy the url into clipboard when clicking the element
function copyRecordUrl() {
  let urlElement = document.getElementById("recordUrl");
  urlElement.select(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
  document.execCommand('copy');
}


export default Control;