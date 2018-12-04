import posed from 'react-pose';


export const DivPosedTransY = posed.div({
  enter: {
    y: 0,
    opacity: 1
  },
  exit: {
    y: 50,
    opacity: 0
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