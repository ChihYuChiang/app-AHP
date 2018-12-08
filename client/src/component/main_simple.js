import React, { Component } from "react";
import { Button, Input } from "reactstrap";

import DynamicInput from "./dynamic-input";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";

import CONST from "../js/const";


class Main extends Component {
  state = {
    stage: CONST.SIMPLE_STAGE.INPUT,
    problem: '',
    options: [],
    magic: ''
  };

  //TODO: shuffle current options
  render() {
    return (
      <div className="container">
        <div className="col-12" align="center">
          <div className="spacer-100"></div>
          <Header location={CONST.LOCATION.SIMPLE} />
          <div className="content mt-4">
            <Loading isLoading={this.state.stage === CONST.SIMPLE_STAGE.LOADING}/>
          </div>
          <DynamicInput
            show={this.state.stage === CONST.SIMPLE_STAGE.INPUT}
            submitInput={this.submitInput}
          />
          <MagicInput
            show={this.state.stage === CONST.SIMPLE_STAGE.MAGIC}
            updateMagic={this.updateMagic}
            computeResult={this.computeResult}
          />
          <Output
            show={this.state.stage === CONST.SIMPLE_STAGE.RESULT}
            createNew={this.createNew}
          />
          <Footer location={CONST.LOCATION.SIMPLE} />
          <div className="spacer-100"></div>
        </div>
      </div>
    );
  }


  submitInput = (input) => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.MAGIC,
      ...input
    });
  }

  updateMagic = (evt) => {
    this.setState({
      magic: evt.target.value
    });
  }

  computeResult = () => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.RESULT
    });
  }

  createNew = () => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.INPUT
    });
  }
}


function MagicInput(props) {
  /*
    props = {
      show //Show or hide this component
      updateMagic //Update magic word to `main`
      computeResult //Update app stage to result
    }
  */
  
  if (props.show) {
    return (
      //Use DOM element value attribute to maintain input state
      //(instead of maintaining by component states) 
      <div>
        <p>What's your favorite movie?</p>
        <Input className="mb-6 w-75"
          //`autoFocus` with `onFocus` resets `main`'s magic state
          autoFocus
          type="text"
          onChange={props.updateMagic}
          onFocus={props.updateMagic}
        />        
        <Button onClick={props.computeResult}>
          Submit
        </Button>
      </div>
    );
  } else return <div />;
}

function Output(props) {
  /*
    props = {
      show //Show or hide this component
      createNew //Update app stage back to `input`
    }
  */

  if (props.show) {
    return (
      <div>
        <p>Hello!</p>
        <Button onClick={props.createNew}>
          New Problem
        </Button>
      </div>
    );
  } else return <div />;
}


export default Main;