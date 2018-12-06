import posed from 'react-pose';

export const DivPosedPop = posed.div({
  /*
    props = {
      color //In #FFFFFF format
    }
  */
  enter: {
    x: -10,
    y: -10,
    opacity: 1,
    boxShadow: (props) => '10px 10px 20px ' + props.color,
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


export const DivPosedFadeX = posed.div({
  /*
    props = {
      i //Optional, element id for staggering
      delay //Option, delay when enter
    }
  */  
  enter: {
    delay: (props) => (props.delay + props.i * props.delay) || props.delay || 150,
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


export const DivPosedFadeY = posed.div({
  /*
    props = {
      i //Optional, element id for staggering
      delay //Option, delay when enter
    }
  */    
  enter: {
    delay: (props) => (props.delay + props.i * props.delay) || props.delay || 150,
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


export const DivPosedFade = posed.div({
  /*
    props = {
      i //Optional, element id for staggering
      delay //Option, delay when enter
    }
  */    
  enter: {
    delay: (props) => (props.delay + props.i * props.delay) || props.delay || 0,
    opacity: 1
  },
  exit: {
    opacity: 0,
  }
});