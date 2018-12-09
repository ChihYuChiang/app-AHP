import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import { PoseGroup } from 'react-pose';

import { PosedNull, PosedFade, PosedFadeY } from './pose';
import DynamicInput from "./dynamic-input";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";

import randomDecide from "../js/random-decision";
import util from "../js/util";
import CONST from "../js/const";
import CONTENT from "../js/content";


class Main extends Component {
  state = {
    stage: CONST.SIMPLE_STAGE.INPUT,
    problem: '',
    options: [],
    //TODO: refreshed by date
    //Only renewed when the whole page refreshed
    magicId: Math.floor(Math.random() * CONTENT.MAGIC_PROMPTS.length),
    magic: '',
    rec: ''
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
            magicId={this.state.magicId}
            updateMagic={this.updateMagic}
            getRec={this.getRec}
          />
          <Output
            show={this.state.stage === CONST.SIMPLE_STAGE.RESULT}
            magicId={this.state.magicId}
            magic={this.state.magic}
            problem={this.state.problem}   
            rec={this.state.rec}
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

  getRec = () => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.RESULT,
      rec: this.state.options[randomDecide(this.state.options, this.state.magic)]
    });
  }

  createNew = () => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.INPUT
    });
  }
}


function MagicInput(props) {
  //TODO: validate input
  /*
    props = {
      show //Show or hide this component
      magicId //The id for CONTENT's magic prompt array
      updateMagic //Update magic word to `main`
      getRec //Compute rec and update app stage to result
    }
  */
  
  if (props.show) {
    return (
      //Use DOM element value attribute to maintain input state
      //(instead of maintaining by component states)
      //The `PosedNull` layer suffices the key requirement by PoseGroup and enables the sub-components to be posed or not
      <PoseGroup>
        <PosedNull key="magicInput">
          <div className="mb-6" />
          <PosedFadeY>
            <p className="fs-115">{CONTENT.MAGIC_PROMPTS[props.magicId][0]}</p>
            <Input className="w-75"
              //`autoFocus` with `onFocus` resets `main`'s magic state
              autoFocus
              type="text"
              onChange={props.updateMagic}
              onFocus={props.updateMagic}
              onKeyPress={(evt) => {util.handleEnterKey(evt, props.getRec)}}
            />        
          </PosedFadeY>
          <PosedFadeY cDelay={400}>
            <Button className="btn-medium mt-6"
              onClick={props.getRec}
            >Submit
            </Button>
          </PosedFadeY>
        </PosedNull>
      </PoseGroup>
    );
  } else return <PoseGroup />;
}

function Output(props) {
  /*
    props = {
      show //Show or hide this component
      magicId //The id for CONTENT's magic prompt array
      magic //The magic entered
      createNew //Update app stage back to `input`
      rec //Computed recommendation
    }
  */

  if (props.show) {
    return (
      <PoseGroup>
        <PosedNull key="output">
          <div className="black-hole">
            <input
              //For accepting keyboard events
              autoFocus
              type="checkbox"
              onKeyPress={(evt) => {util.handleEnterKey(evt, props.createNew)}}
            />    
          </div>
          <div className="mb-6" />
          <p>{props.problem}</p>
          <PosedFadeY>
            <p className="fs-115 mb-1">{CONTENT.MAGIC_PROMPTS[props.magicId][1].replace(/\{\}/, props.magic)}</p>
          </PosedFadeY>
          <PosedFadeY cDelay={2000}>
            <p className="fs-115">You should choose this one.</p>
          </PosedFadeY>
          <PosedFade cDelay={4000}>
            <h3 className="text-primary mt-5">{props.rec}</h3>
          </PosedFade>
          <PosedFadeY cDelay={7000}>
            <Button className="btn-medium mt-6" onClick={props.createNew}>
              New Problem
            </Button>
          </PosedFadeY>
        </PosedNull>
      </PoseGroup>
    );
  } else return <PoseGroup />;
}


export default Main;