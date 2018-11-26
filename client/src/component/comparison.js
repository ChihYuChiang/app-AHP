import React, { Component } from "react";
import { Button } from "react-bootstrap";

import { genMatrix, genWeight, computeCR } from "../js/com8Matrix";
import util from "../js/util";
import CONST from "../js/const";


class Comparison extends Component {
  /*
    props = {
      handleComData //Add comData into the store
      hideGraph //As the name suggests
      pairData
      //.gId, The id of this pair group, also the parent node's name in the root
      //.pairs, Multiple pair entries, each with source, dest
      //.type, option or criterion
      id2Name //A dict translate node id to the name to be displayed
    }
  */
  state = {
    compares: [],
    confirmation: false
  }

  render() {    
    if (!util.isEmpty(this.props.pairData)) {
      
      if (!this.state.confirmation) {
        return <Button onClick={this.confirmCriteria}>Confirm</Button>;
      }

      let groupLabel = this.props.pairData.type === CONST.DATA_TYPE.CRITERION ? 'Criterion importance' : 'Regarding ' + this.props.id2Name[this.props.pairData.gId];

      let pairs = this.props.pairData.pairs.map((pair) => (
        <Pair key={this.props.pairData.gId + pair.source + '_' + pair.dest}
          type={this.props.pairData.type}
          data={pair}
          updateComData={this.updateComData}
          id2Name={this.props.id2Name}
        />
      ));
  
      return (
        <div className="comparison">
          <p>{groupLabel}</p>
          {pairs}
          <Button onClick={this.handleComData8Reset}>Submit</Button>
        </div>
      );

    } else return <div />;
  }


  handleComData8Reset = () => {
    let [matrix, mIndex] = genMatrix(this.state.compares);
    let weights = genWeight(matrix);
    let CR = computeCR(matrix, weights);

    this.props.handleComData({
      type: this.props.pairData.type,
      gId: this.props.pairData.gId,
      weights: weights,
      mIndex: mIndex
    });
    this.setState({ compares: [] });
  }

  updateComData = (value, data) => {
    data.value = value;
    this.setState((curState) => { //Update uses the current state/prop values requires the function form
      let compares = curState.compares.filter((pair) => pair.dest !== data.dest || pair.source !== data.source);
      compares.push(data);
      curState.compares = compares;
      return curState;
    });
  }

  confirmCriteria = () => {
    this.setState({ confirmation: true });
    this.props.hideGraph();
  }
}


class Pair extends Component {
  /*
    props = {
      data //A pair data, with source, dest
      updateComData //Update the comData state in the parent company
      id2Name //A dict translate node id to the name to be displayed
    }
  */
  state = {
    value: 0
  };

  sliderElement = React.createRef();
  labelElement = React.createRef();
  
  render() {
    let sourceName = this.props.type === CONST.DATA_TYPE.CRITERION ? this.props.id2Name[this.props.data.source] : this.props.data.source;
    let destName = this.props.type === CONST.DATA_TYPE.CRITERION ? this.props.id2Name[this.props.data.dest] : this.props.data.dest;

    return (
      <div>
        <p className="prompt">{sourceName + ' > ' + destName}</p>
          <div className="slider-wrapper">
            <input name="range-slider" type="range" className="fluid-slider" max="8" min="-8" step="1"
              value={this.state.value}
              onChange={this.handleChange}
              onInput={this.genSliderLabel}
              ref={this.sliderElement}
              />
            <span className="range-label" ref={this.labelElement}>{this.state.value}</span>
          </div>
      </div>
    );
  }
  
  componentDidMount() {
    this.props.updateComData(this.state.value, this.props.data); //Set default comData (if not changed by user)
    this.genSliderLabel(); //Set default presentation
  }

  genSliderLabel = () => {
    let sliderElement = this.sliderElement.current;
    let labelElement = this.labelElement.current;
    let labelPosition = (sliderElement.value - sliderElement.min) / (sliderElement.max - sliderElement.min);
  
    if (sliderElement.value === sliderElement.min) {
      labelElement.style.left = labelPosition * 100 + 2 + "%";
    } else if (sliderElement.value === sliderElement.max) {
      labelElement.style.left = labelPosition * 100 - 2 + "%";
    } else {
      labelElement.style.left = labelPosition * 100 + "%";
    }
  }
  
  handleChange = (event) => { //Arrow functions always gets the context from where they have been defined.
    this.setState({ value: +event.target.value }, () => {
      this.props.updateComData(this.state.value, this.props.data);
    });
  }
}

export default Comparison;