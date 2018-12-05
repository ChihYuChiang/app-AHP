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
      tipContent //Content for the tooltip
      tipPlacement //Position of the tooltip
    }
  */
  state = {
    tooltipOpen: false
  };

  render() {
    return (
      <span className={this.props.className}>
        <Button id={this.props.buttonId}
          onClick={this.buttonOnClick8Toggle}>
          {this.props.buttonContent}
        </Button>
        <Tooltip innerClassName="tip-tip" arrowClassName="tip-arrow-bottom"
          placement={this.props.tipPlacement}
          isOpen={this.state.tooltipOpen}
          target={this.props.buttonId}
          toggle={this.toggle}
          delay={{ show: 1500, hide: 200 }}
          offset="40px, 5px">
          {this.props.tipContent}
        </Tooltip>
      </span>
    );
  }


  buttonOnClick8Toggle = () => { //Toggle tip when click button
    if (typeof(this.props.buttonOnClick) === 'function') this.props.buttonOnClick();
    this.toggle();
  }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
}


export class ComponentWTip extends Component {
  /*
    props = {
      className //Classes for the wrapper
      componentId //The id of the component
      component //Content of the component
      tipContent //Content for the tooltip
      tipPlacement //Position of the tooltip
      tipOffset //Refer to Popper config
    }
  */
  state = {
    tooltipOpen: false
  };

  render() {
    let arrowClassName; //Deal with the arrow style
    switch (this.props.tipPlacement) {
      default:
      case "bottom": arrowClassName = "tip-arrow-bottom"; break;
      case "top"   : arrowClassName = "tip-arrow-top";    break;
      case "right" : arrowClassName = "tip-arrow-right";  break;
      case "left"  : arrowClassName = "tip-arrow-left";   break;
    }

    return (
      <span className={this.props.className}>
        {this.props.component}
        <Tooltip innerClassName="tip-tip" arrowClassName={arrowClassName}
          placement={this.props.tipPlacement}
          isOpen={this.state.tooltipOpen}
          target={this.props.componentId}
          toggle={this.toggle}
          delay={{ show: 1500, hide: 200 }}
          offset={this.props.tipOffset}>
          {this.props.tipContent}
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