import React from 'react';

import styles from '../scss/variable.scss';


export const Loading = (props) => {
  if (props.isLoading) {
    return(
      <div>
        <div className="d-flex justify-content-center">
          <span
            className="fa fa-cog fa-spin fa-3x"
            style={{ color: styles.primary }}
          />
        </div>
        <p
          className="d-flex justify-content-center small"
          style={{ color: styles.gray700 }}
        >Loading ...</p>
      </div>
    );
  }
  else return <div></div>;
};