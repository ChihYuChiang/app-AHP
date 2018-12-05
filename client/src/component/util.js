import React, { Component } from "react";
import { Button, Tooltip } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { DivPosed } from './pose';

import styles from '../scss/variable.scss';


export const Loading = (props) => <PoseGroup>{props.isLoading && LoadingContent}</PoseGroup>; //&& operator returns the right one if both true

const LoadingContent = (
  <DivPosed key="loading">
    <div className="d-flex justify-content-center">
      <i
        className="fas fa-cog fa-spin fa-3x"
        style={{ color: styles.gray800 }}
      />
    </div>
    <p
      className="d-flex justify-content-center small mt-1"
      style={{ color: styles.gray800 }}
    >Loading ...</p>
  </DivPosed>
);


export class ButtonWTip extends Component {
  /*
    props = {
      className //Classes for the wrapper
      buttonId //The id of the button element
      buttonContent //Content for the button
      buttonOnClick //As name
      popContent //Content for the popover
      popPlacement //Position of the popover
    }
  */
  state = {
    tooltipOpen: false
  };

  render() {
    return (
      <span className={this.props.className}>
        <Button id={this.props.buttonId}
          onClick={this.props.buttonOnClick}>
          {this.props.buttonContent}
        </Button>
        <Tooltip innerClassName="tip-tip" arrowClassName="tip-arrow"
          placement={this.props.popPlacement}
          isOpen={this.state.tooltipOpen}
          target={this.props.buttonId}
          toggle={this.toggle}
          delay={{ show: 1000, hide: 200 }}
          offset="0px, 5px">
          {this.props.popContent}
        </Tooltip>
      </span>
    );
  }


  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
}