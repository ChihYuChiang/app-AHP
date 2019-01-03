import STYLE from "../scss/variable.scss";


const main = {
  GRAPH: {
    BAR_HEIGHT: 67,
    BAR_WIDTH: 100,
    LEGEND_ITEM_HEIGHT: 22,
    SLIDER_WIDTH: STYLE.SLIDER_WIDTH
  },
  POSE_DELAY: {
    PHASE_0: 0,
    PHASE_1: 500,
    PHASE_2: 1000,
    PHASE_3: 1500,
    LANDING: STYLE.TITLE_ANIM_LENGTH * 1000, //Second to millisecond
    STAGGER_INTERVAL: 150
  }
}


export default main;