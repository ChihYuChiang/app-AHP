import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFade } from './pose';

import util from '../js/util';
import styles from '../scss/variable.scss';


export function Title(props) {
  //TODO: remove subtitle when not needed
  return (
    <PoseGroup animateOnMount={true}>
      <PosedFade key="title" cDelay={200}>
        <h1>{props.title}</h1>
      </PosedFade>
      <PosedFade key="subTitle" cDelay={600}>
        <div className="col-8">{props.subTitle}</div>
      </PosedFade>
    </PoseGroup>
  );
}

Title.propTypes = {
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node
};


export function Loading(props) { //TODO: split text effect ...
  const loadingContent = (
    <PosedFade key="loading">
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
    </PosedFade> //TODO: Random loading message
  );
  
  return (
    //&& operator returns the right one if both true
    <PoseGroup animateOnMount={true}>{props.isLoading && loadingContent}</PoseGroup>
  );
}

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired
};


//TODO: can't perform react update warning
export class ButtonWTip extends Component {
  state = {
    tooltipOpen: false,
    tooltipVisible: "invisible" //Bootstrap class
  };
  _isMounted = false; //Avoid updating states of unmounted elements
  //https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html

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

  componentDidMount() {this._isMounted = true;}
  
  componentWillUnmount() {this._isMounted = false;}


  buttonOnClick8Close = () => { //Close tip when click button
    if (typeof(this.props.buttonOnClick) === 'function') this.props.buttonOnClick();
    this.closeTip();
  };

  openTip = () => {
    this.setState({
      tooltipOpen: true,
      tooltipVisible: "invisible"
    }, async () => {
      await util.sleep(1500);
      if (this._isMounted) {
        this.setState({
          tooltipVisible: "visible"
        });
      }
    });
  };

  closeTip = async () => {
    await util.sleep(200);
    if (this._isMounted) {
      this.setState({
        tooltipOpen: false,
        tooltipVisible: "vis-hidden"
      });
    }
  };
}

ButtonWTip.propTypes = {
  className: PropTypes.string, //Classes for the wrapper
  buttonId: PropTypes.string.isRequired, //The id of the button element
  buttonContent: PropTypes.node.isRequired, //Content for the button
  buttonOnClick: PropTypes.func, //As name
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
};


export class ComponentWTip extends Component {
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
  };
}

ComponentWTip.propTypes = {
  className: PropTypes.string, //Classes for the wrapper
  componentId: PropTypes.string.isRequired, //The id of the component
  component: PropTypes.element.isRequired, //Content of the component
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
  tipPlacement: PropTypes.string, //Position of the tooltip
  tipOffset: PropTypes.string //Refer to Popper config; "5px"
};