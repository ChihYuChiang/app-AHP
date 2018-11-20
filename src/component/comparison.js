import React, { Component } from "react";
import { Button } from "react-bootstrap";


class Comparison extends Component {
  state = {
    comData: {}
  };

  render() {
    let tmp = ['a', 'b', 'c'];
    let pairs = tmp.map((id) => (<Pair key={id} id={id} updateComData={this.updateComData} />));

    return (
      <div className="comparison">
        {pairs}
        <Button onClick={() => {this.props.handleComData(this.state.comData);}}>Submit</Button>
      </div>
    );
  }

  updateComData = (id, value) => {
    this.setState({
      comData: {
        ...this.state.comData,
        [id]: value
      }
    });
  }
}


class Pair extends Component {
  state = {
    value: 5
  };

  sliderElement = React.createRef();
  labelElement = React.createRef();
  
  render() {
    return (
      <div className="slider-wrapper">
        <input name="range-slider" type="range" className="fluid-slider" max="9" min="1" step="1"
          value={this.state.value}
          onChange={this.handleChange}
          onInput={this.genSliderLabel}
          ref={this.sliderElement}
          />
        <span className="range-label" ref={this.labelElement}>{this.state.value}</span>
      </div>
    );
  }
  
  componentDidMount() {
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
    this.setState({ value: event.target.value }, () => {
      this.props.updateComData(this.props.id, this.state.value);
    });
  }
}

export default Comparison;