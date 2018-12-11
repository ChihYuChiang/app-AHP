import posed from 'react-pose';
//Note: PoseGroup can only be used locally, within each React component


export const POSE_MEASURE = {
  DELAY_INTERVAL: 150
}


//An empty Posed component to pass pose stages to its children
export const PosedNull = posed.div({
  enter: {},
  exit: {}
});


export const PosedPop = posed.div({
  /*
    props = {
      cColor //In #FFFFFF format
    }
  */
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
  /*
    props = {
      i //Optional, element id for staggering
      cDelay //Option, delay when enter (keyword `delay` is used by Pose module)
    }
  */  
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || (POSE_MEASURE.DELAY_INTERVAL + props.i * POSE_MEASURE.DELAY_INTERVAL) || props.cDelay || POSE_MEASURE.DELAY_INTERVAL,
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


export const PosedFadeY = posed.div({
  /*
    props = {
      i //Optional, element id for staggering
      cDelay //Option, delay when enter
    }
  */    
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || (POSE_MEASURE.DELAY_INTERVAL + props.i * POSE_MEASURE.DELAY_INTERVAL) || props.cDelay || POSE_MEASURE.DELAY_INTERVAL,
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


export const PosedFade = posed.div({
  /*
    props = {
      i //Optional, element id for staggering
      cDelay //Option, delay when enter
      cDurEx //Option, duration when exit
    }
  */    
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