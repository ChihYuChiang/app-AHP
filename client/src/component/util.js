import React, { Component } from "react";
import { Button, Tooltip } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { DivPosedFade } from './pose';

import util from '../js/util';
import styles from '../scss/variable.scss';


export function Title(props) {
  /*
    props = {
      title
      subTitle
    }
  */
  return (
    <PoseGroup animateOnMount={true}>
      <DivPosedFade key="title" delay={200}>
        <h1>{props.title}</h1>
        <p className="col-8">{props.subTitle}</p>
      </DivPosedFade>
    </PoseGroup>
  );
}


export function Loading(props) {
  const loadingContent = (
    <DivPosedFade key="loading">
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
    </DivPosedFade> //TODO: Random loading message
  );
  
  return (
    //&& operator returns the right one if both true
    <PoseGroup animateOnMount={true}>{props.isLoading && loadingContent}</PoseGroup>
  );
}


export class ButtonWTip extends Component {
  /*
    props = {
      className //Classes for the wrapper
      buttonId //The id of the button element
      buttonContent //Content for the button
      buttonOnClick //As name
      tipContent //Content for the tooltip
    }
  */
  state = {
    tooltipOpen: false,
    tooltipVisible: "vis-hidden"
  };

  render() {
    return (
      <span className={this.props.className}>
        <Button id={this.props.buttonId}
          onMouseOver={this.openTip}
          onMouseLeave={this.closeTip}
          onClick={this.buttonOnClick8Close}>
          {this.props.buttonContent}
        </Button>
        <Tooltip className={this.state.tooltipVisible} innerClassName="tip-tip" arrowClassName="tip-arrow-bottom"
          placement="bottom"
          isOpen={this.state.tooltipOpen}
          target={this.props.buttonId}
          offset="40px, 5px" //Use manual and element visibility to make the transition smoother
          trigger="manual">
          {this.props.tipContent}
        </Tooltip>
      </span>
    );
  }


  buttonOnClick8Close = () => { //Close tip when click button
    if (typeof(this.props.buttonOnClick) === 'function') this.props.buttonOnClick();
    this.closeTip();
  }

  openTip = () => {
    this.setState({
      tooltipOpen: true,
      tooltipVisible: "vis-hidden"
    }, async () => {
      await util.sleep(1500);
      this.setState({
        tooltipVisible: "vis-visible"
      });
    });
  }

  closeTip = async () => {
    await util.sleep(200);
    this.setState({
      tooltipOpen: false,
      tooltipVisible: "vis-hidden"
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
          offset={this.props.tipOffset}
          trigger="hover">
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