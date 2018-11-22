import React, { Component } from "react";
import { Button } from "react-bootstrap";

import { genMatrix, genWeight, computeCR } from "../js/pair8Matrix";


class Comparison extends Component {
  /*
    props = {
      handleComData //Add comData into the store
      pairs //Multiple pair entries, each with source, dest
      gId //The id of this pair group, also the parent node's name in the root
    }
  */
  constructor(props) {
    super(props);

    this.state = {
      compares: []
    }
  }

  render() {
    if (this.props.pairs) {
      let pairs = this.props.pairs.map((pair) => (<Pair key={pair.source + 'to' + pair.dest} data={pair} updateComData={this.updateComData} />));
  
      return (
        <div className="comparison">
          {pairs}
          <Button onClick={this.handleComData8Reset}>Submit</Button>
        </div>
      );

    } else return <div />
  }

  handleComData8Reset = () => {
    let [matrix, mIndex] = genMatrix(this.state.compares);
    let weights = genWeight(matrix);
    let CR = computeCR(matrix, weights);

    this.props.handleComData({
      gId: this.props.gId,
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
}


class Pair extends Component {
  /*
    props = {
      data //A pair data, with source, dest
      updateComData //Update the comData state in the parent company
    }
  */
  state = {
    value: 5
  };

  sliderElement = React.createRef();
  labelElement = React.createRef();
  
  render() {
    return (
      <div>
        <p className="prompt">{this.props.data.source + '>' + this.props.data.dest}</p>
          <div className="slider-wrapper">
            <input name="range-slider" type="range" className="fluid-slider" max="9" min="1" step="1"
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