import React, { Component } from "react";
import { Button, Form, Input } from 'reactstrap';

class DynamicInput extends Component {
  state = {
    name: '',
    options: [{ option: '' }, { option: '' }],
  };

  render() { //TODO: content check
    return (
      <Form onSubmit={this.submit}>
        <Input className="mb-6 w-75"
          type="text"
          placeholder="Company name, e.g. Magic Everywhere LLC"
          value={this.state.name}
          onChange={this.updateProblem}
        />

        <p className="fs-115">Options</p>

        {this.state.options.map((option, idx) => (
          <div key={idx} className="mb-4">
            <Input className="d-inline w-50"
              type="text"
              placeholder={`option #${idx + 1} name`}
              value={option.name}
              onChange={this.updateOption(idx)}
            />
            <span className="close float-none ml-2" onClick={this.removeOption(idx)}>&times;</span>
          </div>
        ))}

        <div>
          <Button onClick={this.addOption}>Add option</Button>
          <Button className="ml-5">Incorporate</Button>
        </div>
      </Form>
    ) //The last one is the submit btn
  }


  updateProblem = (evt) => {
    this.setState({ name: evt.target.value });
  }

  submit = (evt) => {
    evt.preventDefault();

    const { name, options } = this.state;
    alert(`Incorporated: ${name} with ${options.length} options`);
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
    this.setState({ options: this.state.options.filter((s, sidx) => idx !== sidx) });
  }
}


export default DynamicInput;