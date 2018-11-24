import React from "react";


function FileInput () {
  return (
    <div>
      <input type="file" name="file" id="input" accept=".xlsx" className="inputfile"/>
      <label htmlFor="input">Choose a file</label>
    </div>
  );
}


export default FileInput;