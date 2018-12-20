import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Input } from "reactstrap";
import { PoseGroup } from 'react-pose';

import { PosedNull, PosedFade, PosedFadeY, PosedAttX } from './pose';
import DynamicInput from "./dynamic-input";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";

import Validator from "../js/validate";
import randomDecide from "../js/random-decision";
import util from "../js/util";
import CONST from "../js/const";
import CONTENT from "../js/content";


//TODO: simple instruction
//TODO: database record input
class Main extends Component {
  state = {
    stage: CONST.SIMPLE_STAGE.INPUT,
    problem: '',
    options: [],
    //Only renewed when the whole page refreshed
    magicId: Math.floor(Math.random() * CONTENT.MAGIC_PROMPTS.length),
    magic: '',
    rec: ''
  };

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
            magic={this.state.magic}
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
      rec: this.state.options[randomDecide(this.state.options, this.state.magic, this.state.problem)]
    });
  }

  createNew = () => {
    this.setState({
      stage: CONST.SIMPLE_STAGE.INPUT
    });
  }
}


class MagicInput extends Component {
  state = {
    pose_magic: ''
  }; 
  
  render() {
    if (this.props.show) {
      return (
        //Use DOM element value attribute to maintain input state
        //(instead of maintaining by component states)
        //The `PosedNull` layer suffices the key requirement by PoseGroup and enables the sub-components to be posed or not
        <PoseGroup>
          <PosedNull key="magicInput">
            <div className="mb-6" />
            <PosedFadeY>
              <p className="fs-115">{CONTENT.MAGIC_PROMPTS[this.props.magicId][0]}</p>
              <PosedAttX pose={this.state.pose_magic}>
                <Input className="w-75"
                  //`autoFocus` with `onFocus` resets `main`'s magic state
                  autoFocus
                  type="text"
                  onChange={this.props.updateMagic}
                  onFocus={this.props.updateMagic}
                  onKeyPress={(evt) => {util.handleEnterKey(evt, this.submit)}}
                  innerRef={(element) => {this.ref_magic = element;}}
                />
              </PosedAttX>
            </PosedFadeY>
            <PosedFadeY cDelay={400}>
              <Button className="btn-medium mt-6"
                onClick={this.submit}
              >Submit
              </Button>
              <p className="text-muted fs-85 mt-3 w-75">{CONTENT.INSTRUCTION.SIMPLE}</p>
            </PosedFadeY>
          </PosedNull>
        </PoseGroup>
      );
    } else return <PoseGroup />;
  }


  submit = () => {
    let validate = new Validator(this.props.magic).removeSpace().longerThan(2)
    if (!validate.pass) {
      this.attMagic();
      return;
    }
    this.props.getRec();
  }
  
  attMagic = () => {
    this.ref_magic.focus();
    this.setState({pose_magic: "attention"}, () => {
      util.sleep(300).then(() => {
        this.setState({pose_magic: "offAttention"});
      });
    })
  }
}

MagicInput.propTypes = {
  show: PropTypes.bool.isRequired, //Show or hide this component
  magic: PropTypes.string.isRequired, //Magic keyword from `main`
  magicId: PropTypes.number.isRequired, //The id for CONTENT's magic prompt array
  updateMagic: PropTypes.func.isRequired, //Update magic word to `main`
  getRec: PropTypes.func.isRequired //Compute rec and update app stage to result
};


function Output(props) {
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
          <div className="mb-4" />
          <PosedFadeY>
            <p className="text-muted mb-3">{props.problem}</p>
          </PosedFadeY>
          <PosedFadeY cDelay={1000}>
            <p className="fs-115 mb-1">
              {CONTENT.MAGIC_PROMPTS[props.magicId][1].replace(/\{\}/, props.magic)}
              <br />
              You should choose this one.
            </p>
          </PosedFadeY>
          <PosedFade cDelay={3000}>
            <h3 className="text-primary mt-5">{props.rec}</h3>
          </PosedFade>
          <PosedFadeY cDelay={5500}>
            <Button className="btn-medium mt-6" onClick={props.createNew}>
              New Problem
            </Button>
          </PosedFadeY>
        </PosedNull>
      </PoseGroup>
    );
  } else return <PoseGroup />;
}

Output.propTypes = {
  show: PropTypes.bool.isRequired, //Show or hide this component
  magic: PropTypes.string.isRequired, //The magic entered
  magicId: PropTypes.number.isRequired, //The id for CONTENT's magic prompt array
  createNew: PropTypes.func.isRequired, //Update app stage back to `input`
  rec: PropTypes.string.isRequired //Computed recommendation
};


export default Main;