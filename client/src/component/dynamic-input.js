import React, { Component } from "react";
import { Button, Form, Input } from 'reactstrap';


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

  render() { //TODO: content check
    if (this.props.show) {
      let inputItems = this.state.options.map((option, idx) => (
        <div key={"option_" + idx} className="mb-4">
          <Input className="d-inline w-50"
            type="text"
            placeholder={`Option #${idx + 1}`}
            value={option.name}
            onChange={this.updateOption(idx)}
          />
          <span className="close float-none ml-2" onClick={this.removeOption(idx)}>&times;</span>
        </div>
      ));

      return (
        <Form onSubmit={this.submit}>
          <Input className="mb-6 w-75"
            autoFocus
            type="text"
            placeholder="A problem, e.g. What for my lunch?"
            value={this.state.problem}
            onChange={this.updateProblem}
          />
          <p className="fs-115">Options</p>
          {inputItems}
          <div>
            <Button onClick={this.addOption}>Add Option</Button>
            <Button className="ml-5">Submit</Button>
          </div>
        </Form>
      ); //The last one is the submit btn
    } else return <div />;
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