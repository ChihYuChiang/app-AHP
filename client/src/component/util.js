import React from 'react';
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
