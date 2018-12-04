import posed from 'react-pose';


export const DivPosedTransY = posed.div({
  enter: {
    delay: (props) => (150 + props.i * 150) || 150,
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

export const DivPosedTransX = posed.div({
  enter: {
    delay: (props) => (150 + props.i * 150) || 150,
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

export const DivPosed = posed.div({
  enter: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
});