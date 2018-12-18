import React from "react";
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { PoseGroup } from 'react-pose';
import Tippy from '@tippy.js/react';

import { PosedFade } from './pose';

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


export function ButtonWTip(props) {
  return (
    <Tippy
      content={props.tipContent}
      theme="light"
      placement="bottom" offset="40px, 5px" arrow={true} maxWidth="200px"
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
      placement={props.tipPlacement} offset={props.tipOffset} arrow={true} maxWidth="200px"
      animation="shift-toward" duration={[350, 200]} delay={[1000, 50]} inertia={true}
      performance={true}>
      {props.component}
    </Tippy>
  );
}

ComponentWTip.propTypes = {
  component: PropTypes.element.isRequired, //Content of the component
  tipContent: PropTypes.node.isRequired, //Content for the tooltip
  tipPlacement: PropTypes.string, //Position of the tooltip
  tipOffset: PropTypes.string //Refer to Popper config; "5px"
};