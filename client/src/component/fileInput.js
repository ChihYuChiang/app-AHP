import React from "react";
import { Button } from "react-bootstrap";


function FileInput () {
  return (
    <div>
      <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
      <label htmlFor="input">Choose a file</label>

      <Button>Demo</Button>
      <Button>Export Result</Button>
    </div>
  );
}


export default FileInput;