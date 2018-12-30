import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { PoseGroup } from 'react-pose';
import Tippy from '@tippy.js/react';

import { PosedFade, PosedLoadingDots } from './pose';

import util from '../js/util';
import CONST from '../js/const';
import styles from '../scss/variable.scss';

const maxTipWidth = "250px";


export function Title(props) {
  return (
    <PoseGroup animateOnMount={true}>
      <PosedFade key={"title_" + props.title} cDelay={200}>
        <h1>{props.title}</h1>
      </PosedFade>
      <PosedFade key={"subTitle_" + props.title} cDelay={600}>
        <div className="col-8 mt-4">{props.subTitle}</div>
      </PosedFade>
    </PoseGroup>
  );
}

Title.propTypes = {
  title: PropTypes.node.isRequired,
  subTitle: PropTypes.node
};


export function Loading(props) {
  const loadingContent = (
    <PosedFade key="loading" className={props.className}>
      <div className="d-flex justify-content-center">
        <i className="fas fa-cog fa-spin fa-3x" style={{ color: styles.gray800 }} />
      </div>
      <div className="d-flex justify-content-center small mt-1" style={{ color: styles.gray800 }}>
        Loading<PosedLoadingDots> ...</PosedLoadingDots>
      </div>
    </PosedFade>
  );
  
  return (
    //&& operator returns the right one if both true
    <PoseGroup animateOnMount={true}>{props.isLoading && loadingContent}</PoseGroup>
  );
}

Loading.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool.isRequired
};


export function ButtonWTip(props) {
  return (
    <Tippy
      content={props.tipContent}
      theme="light"
      placement="bottom" offset="40px, 5px" arrow={true} maxWidth={maxTipWidth}
      animation="shift-toward" duration={[350, 200]} delay={[1000, 50]} inertia={true}
      performance={true}>
      <Button
        className={props.className}
        onClick={props.buttonOnClick}>
        {props.buttonContent}
      </Button>
    </Tippy>
  );
}

ButtonWTip.propTypes = {
  className: PropTypes.string, //Classes for the wrapper
  buttonContent: PropTypes.node.isRequired, //Content for the button
  buttonOnClick: PropTypes.func, //As name
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
};


export function ComponentWTip(props) {
  return (
    <Tippy
      content={props.tipContent}
      theme="light"
      placement="bottom" arrow={true} maxWidth={maxTipWidth}
      animation="shift-toward" duration={[350, 200]} delay={[1000, 50]} inertia={true}
      performance={true}
      {...props.tippyConfig}>
      {props.children}
    </Tippy>
  );
}

ComponentWTip.propTypes = {
  children: PropTypes.node.isRequired, //Target component
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
  tippyConfig: PropTypes.object //Overwrite the default settings in Tippy and in this component
};


export class ComponentWTipCf extends Component {
  //Click produces tip, confirm or cancel the underlying action
  tip={};

  render() {
    let buttons;
    switch (this.props.buttonType) {
      default:
      case CONST.TIPBTN_TYPE.CONFIRM:
        buttons = (
          <div className="mt-4">
            <Button size="sm" outline color="info" className="mr-4" onClick={() => {this.hideTip(); this.props.action();}}>
              Proceed
            </Button>
            <Button size="sm" outline color="info" onClick={this.hideTip}>
              Cancel
            </Button>
          </div>
        );
        break;
      case CONST.TIPBTN_TYPE.ALERT:
        buttons = (
          <div className="mt-4">
            <Button size="sm" outline color="info" className="mr-4" onClick={() => {this.hideTip(); this.props.action();}}>
              OK
            </Button>
          </div>
        );
      //TODO: tip component case prompt
    }

    let tipContent8Btn = (
      <div className="m-3">
        <div>
          {this.props.tipContent}
        </div>
        {buttons}
      </div>
    );

    return (
      <Tippy isVisible={this.props.isVisible}
        content={tipContent8Btn}
        theme="light-border" trigger={this.props.trigger} interactive={true}
        placement="top" distance={20} arrow={false} maxWidth="300px"
        animation="shift-away" duration={[250, 100]} delay={[0, 0]} inertia={false}
        performance={true}
        onCreate={this.storeTippyInstance}
        onHidden={this.hideTip} //Manually set `isVisible` to false when hid by Tippy preset auto-mechanisms
        {...this.props.tippyConfig}>
        {this.props.children}
      </Tippy>
    );
  }


  storeTippyInstance = (tip) => {
    this.tip = tip;
  };

  hideTip = () => {
    if (this.props.trigger === "manual" && this.props.isVisible) this.props.toggleVisible();
    else this.tip.hide();
  };
}

ComponentWTipCf.defaultProps = {
  trigger: "click",
  toggleVisible: () => {},
  isVisible: false,
  buttonType: CONST.TIPBTN_TYPE.CONFIRM
}
ComponentWTipCf.propTypes = {
  children: PropTypes.node.isRequired, //Target component
  trigger: PropTypes.string, //Tippy trigger type
  toggleVisible: PropTypes.func, //Prop control when showing the tip
  isVisible: PropTypes.bool,
  buttonType: PropTypes.string, //As its name
  action: PropTypes.func.isRequired, //The action to be made (confirmed by tip)
  tipContent: PropTypes.node.isRequired, //Content for the tooltip, except for the buttons
  tippyConfig: PropTypes.object //Overwrite the default settings in Tippy and in this component
};


export class ComponentWTipFb extends Component  {
  //Click produces tip, close tip after a while
  tip={};

  render() {
    return (
      <Tippy isVisible={this.props.isVisible}
        content={this.props.tipContent}
        theme="darker" trigger={this.props.trigger} hideOnClick={false}
        placement="top" arrow={false} maxWidth={maxTipWidth}
        animation="shift-away" duration={[350, 200]} delay={[0, 0]} inertia={false}
        performance={true}
        onCreate={this.storeTippyInstance}
        onShown={this.hideAfterSometime}
        {...this.props.tippyConfig}>
        <div className="remove-focus-effect">
          {this.props.children}
        </div>
      </Tippy>
    );
  }


  storeTippyInstance = (tip) => {
    this.tip = tip;
  };

  hideAfterSometime = async () => {
    await util.sleep(this.props.hideAfter);
    if (this.props.trigger === "manual") this.props.toggleVisible();
    else this.tip.hide();
  };
}

ComponentWTipFb.defaultProps = {
  trigger: "click",
  toggleVisible: () => {},
  isVisible: false,
  hideAfter: 1200,
}
ComponentWTipFb.propTypes = {
  children: PropTypes.node.isRequired, //Target component
  trigger: PropTypes.string, //Tippy trigger type
  toggleVisible: PropTypes.func, //Prop control when showing the tip
  isVisible: PropTypes.bool,
  hideAfter: PropTypes.number, //ms after which the tip will hide
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
  tippyConfig: PropTypes.object //Overwrite the default settings in Tippy and in this component
};