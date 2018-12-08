import React, { Component } from "react";
import { Button, Form, Input } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedNull, PosedFadeY } from './pose';


const buildDefaultState = () => ({
  problem: '',
  options: [{ name: '' }, { name: '' }]
});


class DynamicInput extends Component {
  /*
    props = {
      show //Show or hide this component
      submitInput //Submit input to `main` and update app stage
    }
  */
  state = {
    ...buildDefaultState()
  };

  render() {
    //TODO: content check
    //TODO: maximum number of options
    //TODO: input checks
    if (this.props.show) {
      let inputItems = this.state.options.map((option, idx, array) => (
        <div key={"option_" + idx} className="mb-4 w-75 row no-gutters">
          <span className="col-1" />
          <span className="col-9">
            <Input className="d-inline mr--4"
              type="text"
              placeholder={`Option #${idx + 1}`}
              value={option.name}
              onChange={this.updateOption(idx)}
            />
            <span className="close float-none" onClick={this.removeOption(idx)}>&times;</span>
          </span>
          {idx + 1 === array.length //Using character entity https://dev.w3.org/html5/html-author/charref
            ? <span className="close float-none col" style={{ marginTop: 4 }} onClick={this.addOption}>&#43;</span>
            : <span className="col" /> //`col` fill the rest; `col-auto` fit the content width
          }
        </div>
      ));

      return (
        <PoseGroup>
          <PosedNull key="dynamicInput">
            <Form onSubmit={this.submit}>
              <PosedFadeY>
                <Input className="mb-6 w-75"
                  autoFocus
                  type="text"
                  placeholder="A problem, e.g. What's for lunch?"
                  value={this.state.problem}
                  onChange={this.updateProblem}
                />
                <p className="fs-115">Options</p>
                {inputItems}
              </PosedFadeY>
              <PosedFadeY cDelay={400}>
                <Button className="btn-medium mt-4">Submit</Button>
              </PosedFadeY>
            </Form>
          </PosedNull>
        </PoseGroup>
      ); //The last one is the submit btn
    } else return <PoseGroup />;
  }


  updateProblem = (evt) => {
    this.setState({ problem: evt.target.value });
  }

  submit = (evt) => {
    evt.preventDefault(); //Default is to refresh page

    this.props.submitInput(this.state);
    this.setState(buildDefaultState()) //Reset state (and the presentation as well)
  }

  updateOption = (idx) => (evt) => {
    const newOptions = this.state.options.map((option, sidx) => {
      if (idx !== sidx) return option;
      return { ...option, name: evt.target.value };
    });

    this.setState({ options: newOptions });
  }

  addOption = () => {
    this.setState({ options: this.state.options.concat([{ name: '' }]) });
  }

  removeOption = (idx) => () => {
    this.setState({ options: this.state.options.filter((_, sidx) => idx !== sidx) });
  }
}


export default DynamicInput;