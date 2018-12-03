import React, { Component } from "react";
import { PoseGroup } from 'react-pose';

import { DivPosed } from './pose';

import styles from '../scss/variable.scss';


export const Loading = (props) => <PoseGroup>{props.isLoading && LoadingContent}</PoseGroup>; //&& operator returns the right one if both true

const LoadingContent = (
  <DivPosed key="loading">
    <div className="d-flex justify-content-center">
      <span
        className="fa fa-cog fa-spin fa-3x"
        style={{ color: styles.gray800 }}
      />
    </div>
    <p
      className="d-flex justify-content-center small"
      style={{ color: styles.gray800 }}
    >Loading ...</p>
  </DivPosed>
);


export class AbsFixTopDiv extends Component {
  constructor(props) {
    super(props);

    //Create a ref to store the DOM element
    this.domElement = React.createRef();
  }
  
  render() {
    return (
      <div ref={this.domElement}></div>
    );
  }

  componentDidMount() {
    window.onscroll = function() {
      let box = this.domElement.current.getBoundingClientRect();
      let fixStyle = JSON.stringify({
        position: "fixed",
        top: 0,
        left: box.left
      });
      if (window.scrollY >= box.top) this.domElement.current.setAttribute("style", fixStyle);
      else this.domElement.current.removeAttribute("style");
    };
  }
}