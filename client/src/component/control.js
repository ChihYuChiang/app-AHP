import React, { Component } from "react";

import { Button, ButtonGroup, ButtonToolbar, Label, Input } from "reactstrap";

import CONST from "../js/const";

class Control extends Component {
  /*
    props = {
      curGraph //App state marker
      getDemoData //Get from db the specified data for demo
      recordResult //Record to db the current comparison data
    }
  */
  state = {
    recordUrl: "" //Set when the user record the result
  };

  render() {
    //TODO popover instruction
    switch (this.props.curGraph) {
      
      case CONST.GRAPH_TYPE.TREE_UPLOAD:
      case CONST.GRAPH_TYPE.TREE_RECORD:
      case CONST.GRAPH_TYPE.COMPARISON:
        return <div />;

      case CONST.GRAPH_TYPE.TREE_UPDATE:
        return (
          <div>
            <Button onClick={this.record8GetUrl}>Record Result</Button>
            <Button className="ml-5" disabled>
              Upload New Criteria
            </Button>
            {/* <div className="col-8 mt-4">
              <Label for="recordUrl">Click to copy the record url</Label >
              <Input type="text" id="recordUrl" readOnly
                onClick={copyRecordUrl}
                value={this.state.recordUrl}
              />
            </div> */}
          </div>
        );

      default:
        return (
          <div>
            <input
              type="file"
              id="inputCriterionFile"
              accept=".xlsx"
              className="file-input"
            />
            <ButtonToolbar className="justify-content-center">
              <Button className="mr-2" onClick={this.props.renderDemoGraph}>
                Demo Result
              </Button>
              <ButtonGroup>
                <Button>
                  <a href={`${CONST.PATH.TEMPLATE_SERVER}/api/template`} download>
                    Download Template
                  </a>
                </Button>
                <Button>
                  <label htmlFor="inputCriterionFile" className="file-label">
                    Upload Your Criteria
                  </label>
                </Button>
              </ButtonGroup>
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

//Copy the url into clipboard when clicking the element
function copyRecordUrl() {
  let urlElement = document.getElementById("recordUrl");
  urlElement.select(); //https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
  document.execCommand("copy");
}

export default Control;
