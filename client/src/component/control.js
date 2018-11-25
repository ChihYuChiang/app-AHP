import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";


function Control () {
  return (
    <div>
      <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
      <label htmlFor="input">Choose a file</label>

      <Button>Demo</Button>
      <Button>Record Result</Button>
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


function copyRecordUrl() {
  let urlElement = document.getElementById("recordUrl");
  urlElement.select(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
  document.execCommand('copy');
}


export default Control;