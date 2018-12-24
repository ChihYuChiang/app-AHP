import React, { Component } from "react";
import PropTypes from 'prop-types';

import { PosedExpandY, PosedRotate180 } from './pose';

import CONST from "../js/const";
import CONTENT from "../js/content";
import styles from "../scss/variable.scss";


class GroupLabel extends Component {
  state = {
    instructExpand: true //Control showing or hiding the score explanation
  };

  render() {
    let flipper = (
      <PosedRotate180 pose={this.state.instructExpand ? "upright" : "upSideDown"} className="expand-flipper">
        <i className="fas fa-caret-down fs-115" onClick={this.toggleInstruct} />
      </PosedRotate180>
    );

    if (this.props.pairDataType === CONST.DATA_TYPE.CRITERION) {
      return (
        <div className={this.props.className}>
          <div>
            {"Regarding "}
            <span className="text-primary">
              {this.props.pairDataGId === "0-0" ? "the base criteria" : this.props.id2Name[this.props.pairDataGId]}
            </span>
            <span className="mr-sucker">
              {", what is more important?"}
            </span>
            {flipper}
          </div>
          <PosedExpandY pose={this.state.instructExpand ? "expanded" : "collapsed"}>
            <div className="instruction">
              {CONTENT.INSTRUCTION.COM_CRITERION}
            </div>
          </PosedExpandY>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}>
          <div>
            {"Regarding "}
            <span className="text-primary">
              {this.props.id2Name[this.props.pairDataGId]}
            </span>
            <span className="mr-sucker">
              {", which option has advantage?"}
            </span>
            {flipper}
          </div>
          <PosedExpandY pose={this.state.instructExpand ? "expanded" : "collapsed"}>
            <div className="instruction">
              {CONTENT.INSTRUCTION.COM_OPTION}
            </div>
          </PosedExpandY>          
        </div>
      );
    }
  }


  toggleInstruct = () => {
    this.setState({ instructExpand: !this.state.instructExpand });
  };
}

GroupLabel.propTypes = { //As in the parent
  pairDataType: PropTypes.string.isRequired,
  pairDataGId: PropTypes.string.isRequired,
  id2Name: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.string
};


class Pair extends Component { //TODO: better comparison format? tip when sliding?
  state = {
    value: this.props.data.value || 0
  };

  sliderElement = React.createRef();
  labelElement = React.createRef();
  
  render() {
    let sourceName = this.props.type === CONST.DATA_TYPE.CRITERION
      ? this.props.id2Name[this.props.data.source]
      : this.props.options.filter((op) => op.id + '' === this.props.data.source)[0].name;
    let destName = this.props.type === CONST.DATA_TYPE.CRITERION
      ? this.props.id2Name[this.props.data.dest]
      : this.props.options.filter((op) => op.id + '' === this.props.data.dest)[0].name;

    return (
      <div>
        <p>{destName}<span className="text-secondary ml-2 mr-2">or</span>{sourceName}</p>
        <div>
          <input name="range-slider" type="range" className="fluid-slider" max="8" min="-8" step="1"
            data-source={sourceName}
            data-dest={destName}
            value={this.state.value}
            onChange={this.handleChange}
            onInput={this.genSliderLabel}
            ref={this.sliderElement}
            />
          <span className="range-label" ref={this.labelElement}>{Math.abs(this.state.value) / 2}</span>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    this.props.updateComData({
      ...this.props.data,
      value: this.state.value
    }); //Set default comData (if not changed by user)
    this.genSliderLabel(); //Set default presentation
  }


  genSliderLabel = () => {
    let sliderElement = this.sliderElement.current;
    let labelElement = this.labelElement.current;
    let labelPosition = (sliderElement.value - sliderElement.min) / (sliderElement.max - sliderElement.min);
  
    labelElement.style.left = labelPosition * (styles.sliderWidth - 19) - 120 + "px";
  };
  
  handleChange = (event) => { //Arrow functions always gets the context from where they have been defined.
    this.setState({ value: +event.target.value }, () => {
      this.props.updateComData({
        ...this.props.data,
        value: this.state.value
      });
    });
  };
}

Pair.propTypes = {
  data: PropTypes.exact({
    source: PropTypes.string.isRequired,
    dest: PropTypes.string.isRequired,
    value: PropTypes.number //Will be inserted after comparison
  }).isRequired,  //A pair data, with source, dest
  updateComData: PropTypes.func.isRequired, //Update the comData state in the parent company
  id2Name: PropTypes.objectOf(PropTypes.string).isRequired, //A dict translate node id to the name to be displayed
  options: PropTypes.arrayOf(PropTypes.object).isRequired //Aa array of option items
};


export { GroupLabel, Pair };