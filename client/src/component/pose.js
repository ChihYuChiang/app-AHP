import React, { Component } from "react";
import posed from 'react-pose';
import SplitText from 'react-pose-text';
import PropTypes from 'prop-types';

import util from '../js/util';

import MEASURE from '../share/measure';
//Note: PoseGroup can only be used locally, within each React component


//TODO: draw tick
//https://codepen.io/popmotion/pen/yPxNao?editors=0010
//An empty Posed component to pass pose stages to its children / as placeholder
export const PosedNull = posed.div({
  enter: {},
  exit: {}
});


export const PosedPop = posed.div({
  enter: {
    x: -10,
    y: -10,
    opacity: 1,
    boxShadow: (props) => '10px 10px 20px ' + props.cColor,
    transition: { duration: 700 }
  },
  exit: {
    x: 0,
    y: 0,
    opacity: 0,
    boxShadow: '0px 0px 0px #FFFFFF',
  }
});

PosedPop.propTypes = {
  cColor: PropTypes.string.isRequired //In #FFFFFF format
}


export const PosedAttX = posed.div({
  attention: {
    applyAtStart: { x: 5 },
    x: -5,
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 0
    }
  },
  offAttention: {
    x: 0
  }
});


export const PosedAttY = posed.div({
  attention: {
    applyAtStart: { y: 2 },
    y: -2,
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 0
    }
  },
  offAttention: {
    y: 0
  }
});


export const PosedFadeX = posed.div({
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || (MEASURE.POSE_DELAY.STAGGER_INTERVAL + props.i * MEASURE.POSE_DELAY.STAGGER_INTERVAL) || props.cDelay || MEASURE.POSE_DELAY.STAGGER_INTERVAL,
    x: 0,
    opacity: 1
  },
  exit: {
    x: 50,
    opacity: 0,
    transition: {
      duration: 100
    }
  }
});

PosedFadeX.propTypes = {
  i: PropTypes.number, //Optional, element id for staggering
  cDelay: PropTypes.number //Option, delay when enter
}


export const PosedFadeY = posed.div({
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || (MEASURE.POSE_DELAY.STAGGER_INTERVAL + props.i * MEASURE.POSE_DELAY.STAGGER_INTERVAL) || props.cDelay || MEASURE.POSE_DELAY.STAGGER_INTERVAL,
    y: 0,
    opacity: 1
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 100
    }
  }
});

PosedFadeY.propTypes = {
  i: PropTypes.number, //Optional, element id for staggering
  cDelay: PropTypes.number //Option, delay when enter
}


export const PosedFade = posed.div({
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || props.cDelay || 0,
    opacity: 1
  },
  exit: {
    opacity: 0,
    transition: (props) => ({
      duration: props.cDurEx || 100
    })
  }
});

PosedFade.propTypes = {
  i: PropTypes.number, //Optional, element id for staggering
  cDelay: PropTypes.number, //Option, delay when enter
  cDurEx: PropTypes.number //Option, duration when exit
}


const _PosedExpandY = posed.div({
  collapsed: { height: 0 },
  expanded: { height: 'auto' }
});

export function PosedExpandY(props) {
  return (
    //eslint-disable-next-line
    <_PosedExpandY style={{ overflow: "hidden" }} pose={props.pose}>
      {props.children}
    </_PosedExpandY>
  );
}

PosedExpandY.propTypes = {
  children: PropTypes.node.isRequired, //Target component
  pose: PropTypes.oneOf(['collapsed', 'expanded']).isRequired
};


export const PosedRotate180 = posed.div({
  upright: { rotate: 0, transition: { type: "tween", ease: "easeOut" } },
  upSideDown: { rotate: 180, transition: { type: "tween", ease: "easeOut" } }
});


//Specifically made for the 3 dots in `Loading`
export class PosedLoadingDots extends Component {
  state = {
    pose: "enter",
    preExit: false //For smooth loop
  }
  _isMounted = false;

  poseConfig = {
    exit: {
      opacity: 0,
      transition: { duration: 0 }
    },
    enter: {
      opacity: 1,
      transition: ({ charIndex }) => ({
        delay: charIndex * 500,
        duration: 500
      })
    }
  };

  render() {
    return (
      <SplitText
        initialPose="exit" pose={this.state.pose} charPoses={this.poseConfig}
        onPoseComplete={this.exit} withParent={false}>
        {this.props.children}
      </SplitText>
    );
  }

  componentDidMount() {this._isMounted = true;}
  componentWillUnmount() {this._isMounted = false;}

  exit = async () => {
    if (this.state.preExit === false) {
      this.setState({ preExit: true });

      await util.sleep(1200);
      if (this._isMounted) {
        this.setState({ pose: "exit" });
        await util.sleep(100);
        this.setState({ pose: "enter",  preExit: false });
      }
    }
  };
}

PosedLoadingDots.propTypes = {
  children: PropTypes.node.isRequired, //Target component '...'
};