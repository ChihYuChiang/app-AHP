import posed from 'react-pose';
//Note: PoseGroup can only be used locally, within each React component


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


export const SpanPosedAttention = posed.span({
  attention: {
    scale: 1.3,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 0
    }
  },
  offAttention: {
    scale: 1
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
    delay: (props) => (props.cDelay + props.i * props.cDelay) || props.cDelay || 150,
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
    delay: (props) => (props.cDelay + props.i * props.cDelay) || props.cDelay || 150,
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
    }
  */    
  enter: {
    delay: (props) => (props.cDelay + props.i * props.cDelay) || props.cDelay || 0,
    opacity: 1
  },
  exit: {
    opacity: 0,
  }
});