import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";


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
      <div className="btn-group" role="group">
        <Button><label htmlFor="inputCriterionFile" className="file-label">Choose a File</label></Button>
        <Button>Download Template</Button>
        <Button onClick={props.getDemoData}>Demo</Button>
        <Button onClick={props.recordResult}>Record Result</Button>
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