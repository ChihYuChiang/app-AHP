import React, { Component } from "react";
import { Button, Form, Input } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedNull, PosedFadeY, PosedAttX, PosedFade } from './pose';

import util from "../js/util";
import Validator from "../js/validate";


const buildDefaultState = () => ({
  problem: '',
  options: ['', ''],
  pose_prob: '',
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
    if (this.props.show) {
      let inputItems = this.state.options.map((option, idx, array) => (
        <PosedFade key={"option_" + idx} cDurEx={0}>
          <div className="mb-4 w-75 row no-gutters">
            <span className="col-1" />
            <span className="col-9">
              <Input className="d-inline mr--4"
                type="text"
                placeholder={`Option #${idx + 1}`}
                value={option}
                onChange={this.updateOption(idx)}
              />
              {array.length > 2 //Limit the number of options
                ? <span className="close float-none" onClick={this.removeOption(idx)}>&times;</span>
                : <span className="close float-none no-pointer text-white">&times;</span>
              }
            </span>
            {idx + 1 === array.length && array.length < 7 //Limit the number of options
              //Using character entity https://dev.w3.org/html5/html-author/charref
              ? <span className="close float-none col" style={{ marginTop: 4 }} onClick={this.addOption}>&#43;</span>
              : <span className="col" /> //`col` fill the rest; `col-auto` fit the content width
            }
          </div>
        </PosedFade>
      ));

      return (
        <PoseGroup animateOnMount={true}>
          <PosedNull key="dynamicInput">
            <Form onSubmit={this.submit}>
              <PosedFadeY>
                <PosedAttX pose={this.state.pose_prob}>
                  <Input className="mb-6 w-75"
                    autoFocus
                    type="text"
                    placeholder="A problem, e.g. What's for lunch?"
                    value={this.state.problem}
                    onChange={this.updateProblem}
                    innerRef={(element) => {this.ref_problem = element;}}
                  />
                </PosedAttX>
                <p className="fs-115">Options</p>
                <PoseGroup>{inputItems}</PoseGroup>
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


  attProblem = () => {
    this.ref_problem.focus();
    this.setState({pose_prob: "attention"}, () => {
      util.sleep(300).then(() => {
        this.setState({pose_prob: "offAttention"});
      });
    })
  }

  updateProblem = (evt) => {
    this.setState({ problem: evt.target.value });
  }

  submit = (evt) => {
    evt.preventDefault(); //Default is to refresh page

    let validate = new Validator(this.state.problem).longerThan(3)
    if (!validate.pass) {
      this.attProblem();
      return;
    }

    //Inject default texts
    this.setState((state) => {
      state.options = state.options.map((option, i) => option || "Option #" + (i + 1));
      this.props.submitInput(state);
      state = buildDefaultState(); //Reset state (and the presentation as well)
      return state;
    });
  }

  updateOption = (idx) => (evt) => {
    const newOptions = this.state.options.map((option, sidx) => {
      if (idx !== sidx) return option;
      return evt.target.value;
    });

    this.setState({ options: newOptions });
  }

  addOption = () => {
    this.setState({ options: this.state.options.concat(['']) });
  }

  removeOption = (idx) => () => {
    this.setState({ options: this.state.options.filter((_, sidx) => idx !== sidx) });
  }
}


export default DynamicInput;