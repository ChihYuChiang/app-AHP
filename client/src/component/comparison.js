import React, { Component } from "react";
import { Button } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { DivPosedFadeY } from './pose';
import BreadCrumbC from './bread-crumb';

import { genMatrix, genWeight, computeCR } from "../js/com-matrix";
import util from "../js/util";
import CONST from "../js/const";
import styles from "../scss/variable.scss";


class Comparison extends Component {
  /*
    props = {
      enterComparison //Update graph (app) state
      handleComData //Add comData into the store
      pairData
      //.gId, The id of this pair group, also the parent node's name in the root
      //.breadCrumb, The ids of the ancestor elements (excluding root)
      //.pairs, Multiple pair entries, each with source, dest
      //.type, option or criterion
      id2Name //A dict translate node id to the name to be displayed
      options //Aa array of option items
    }
  */
  state = {
    compares: [],
    confirmation: false
  }

  render() {    
    if (!util.isEmpty(this.props.pairData)) {
      
      if (!this.state.confirmation) {
        return ( //TODO: Modify criteria
          <div>
            <Button className="btn-wide" onClick={this.confirmCriteria}>Confirm</Button>
            {/* <Button className="btn-medium">Modify</Button> */}
          </div>
        );
      }

      let groupLabel = this.props.pairData.type === CONST.DATA_TYPE.CRITERION //TODO: Split text animation
        ? 'Criterion Importance' //TODO: Show breadcrumb
        : <p>Regarding <span className="prompt-highlight">{this.props.id2Name[this.props.pairData.gId]}</span></p>;
      
      let pairs = this.props.pairData.pairs.map((pair, i) => ( //`key` is for both array React Components and Pose identification; `i` is for staggering delay
        <DivPosedFadeY key={this.props.pairData.gId + '_' + pair.source + '_' + pair.dest} i={i} delay={150}>
          <Pair
            type={this.props.pairData.type}
            data={pair}
            updateComData={this.updateComData}
            id2Name={this.props.id2Name}
            options={this.props.options}
          />
        </DivPosedFadeY>
      ));
  
      return ( //animateOnMount=true lets the first element mounted being animated (it's mounted along with the PoseGroup and will not be animated by default)
        <div className="comparison mt-4">
          <BreadCrumbC ancestors = {this.props.pairData.breadCrumb.map((id) => this.props.id2Name[id])} />
          <h6>{groupLabel}</h6>
          <PoseGroup animateOnMount={true}>
            {pairs}
          </PoseGroup>
          <Button className="btn-wide" onClick={this.handleComData8Reset}>Submit</Button>
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
    this.props.enterComparison();
  }
}


class Pair extends Component {
  /*
    props = {
      data //A pair data, with source, dest
      updateComData //Update the comData state in the parent company
      id2Name //A dict translate node id to the name to be displayed
      options //Aa array of option items
    }
  */
  state = {
    value: 0
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

    //TODO: different types of input in /ref
    return ( //TODO: dynamic prompt with score
      <div>
        <p className="prompt">{destName}<span id="vs"> vs </span>{sourceName}</p>
        <div className="slider-wrapper">
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
      //Transform the label for better readability
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
  
    labelElement.style.left = labelPosition * (styles.sliderWidth - 19) - 120 + "px";
  }
  
  handleChange = (event) => { //Arrow functions always gets the context from where they have been defined.
    this.setState({ value: +event.target.value }, () => {
      this.props.updateComData(this.state.value, this.props.data);
    });
  }
}

export default Comparison;