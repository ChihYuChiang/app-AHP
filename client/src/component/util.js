import React from "react";
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