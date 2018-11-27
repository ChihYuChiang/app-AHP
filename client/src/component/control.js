import React from "react";

import { Button, ButtonGroup, ButtonToolbar, Label, Input } from 'reactstrap';

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
      <ButtonToolbar className="justify-content-center">
        <ButtonGroup className="mr-2">
          <Button><label htmlFor="inputCriterionFile" className="file-label">Choose a File</label></Button>
          <Button><a href={`${CONST.PATH.TEMPLATE_SERVER}/api/template`} download>Download Template</a></Button>
          <Button onClick={props.getDemoData}>Demo</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={props.recordResult}>Record Result</Button>
        </ButtonGroup>
      </ButtonToolbar>

      <div className="col-8 mt-4">
        <Label for="recordUrl">Click to copy</Label >
        <Input type="text" id="recordUrl" readOnly
          onClick={copyRecordUrl}
          value={"this is the url for your record"}
        />
      </div>
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