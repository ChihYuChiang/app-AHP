import React, { Component } from "react";

class Pair extends Component {
  state = {
    value: 5
  };

  handleChange = (event) => { //Arrow functions always gets the context from where they have been defined.
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="slider-wrapper">
        <input name="range-slider" type="range" className="fluid-slider" id="range-slider" max="9" min="1" step="1"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <span id="range-label" className="range-label"></span>
      </div>
    );
  }
}

export default Pair;