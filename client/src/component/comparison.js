import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Progress } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { GroupLabel, Pair } from './comparison_label-pair';
import BreadCrumbC from './breadcrumb';
import { PosedFade, PosedFadeY, PosedAttX, PosedNull } from './pose';
import { ButtonWTip, ComponentWTip } from './util';

import { genMatrix, genWeight, computeCR, genCRSolution } from "../js/com-matrix";
import util from "../js/util";
import CONST from "../js/const";
import CONTENT from "../js/content";


//TODO: >>> form
//TODO: a tree to be able to click, to go back and modify
const targetCR = 0.2;
const buildDefaultState = () => ({
  compares: [], //Store the pair data and comparison result
  matrix: [],
  weights: [],
  mIndex: [],
  CR: 0,
  CRSolution: '',
  pose_submitBtn: '',
  showCrTip: false
});
class Comparison extends Component {
  state = {
    ...buildDefaultState()
  };

  render() {
    switch (this.props.curComparison) {

      case CONST.COM_TYPE.REPORT_PRE:
        return (
          <PoseGroup animateOnMount={true}>
            <PosedFadeY className="comparison-wrapper col-8" key="btn" cDelay={CONST.POSE_DELAY.PHASE_2}>
              <ButtonWTip className="btn-medium mr-5"
                buttonContent="Evaluate Again"
                buttonOnClick={this.props.enterComparison}
                tipContent={CONTENT.TIP_BTN.EVALUATE_AGAIN}
              />    
              <Button className="btn-medium" onClick={this.props.exitComparison}>Go to Report</Button>
            </PosedFadeY>
          </PoseGroup>
        );

      case CONST.COM_TYPE.CONFIRM_PRE:
        //Present a rounded int to 10th digit
        let nQuestion = this.props.nQuestion <= 10 ? 10 : Math.round(this.props.nQuestion / 10) * 10;
        let secPerQ = 8; //Time estimate for 1 question
        let nMin = Math.round(this.props.nQuestion * secPerQ / 60) === 0 ? 1 : Math.round(this.props.nQuestion * secPerQ / 60);
        
        return (
          <PoseGroup animateOnMount={true}>
            <PosedFadeY className="comparison-wrapper col-8" key="btn" cDelay={CONST.POSE_DELAY.PHASE_2}>
              <input
                className="file-input"
                id="fileInput-criteria"
                type="file"
                accept=".xlsx"
                onChange={(evt) => {this.props.handleCriterionFile(evt.target.files[0]);}}
              />          
              <p className="mt--3 fs-85">
                Regarding the provided criteria and options, you will answer about <span className="text-primary">{nQuestion} questions</span>.
                This process takes around <span className="text-primary">{nMin} minutes</span>.
              </p>
              <Button className="btn-medium mr-5" onClick={this.props.enterComparison}>Confirm</Button>
              <label htmlFor="fileInput-criteria" className="btn btn-medium btn-secondary">
                Modify
              </label>
            </PosedFadeY>
          </PoseGroup>
        );
      
      case CONST.COM_TYPE.COMPARISON:
        let pairs = this.props.pairData.pairs.map((pair, i) => ( //`key` is for both array React Components and Pose identification; `i` is for staggering delay
          //i = i + x to leave some time for scrolling back to top
          <PosedFadeY key={this.props.pairData.gId + '_' + pair.source + '_' + pair.dest} i={i + 1}>
            <Pair
              type={this.props.pairData.type}
              data={pair}
              updateComData={this.updateComData}
              id2Name={this.props.id2Name}
              options={this.props.options}
            />
          </PosedFadeY>
        ));
    
        return ( //animateOnMount=true lets the first element mounted being animated (it's mounted along with the PoseGroup and will not be animated by default)
          <div className="comparison-wrapper mt-4">
            <PoseGroup animateOnMount={true}>
              <PosedFadeY key="breadCrumb" cDelay={CONST.POSE_DELAY.PHASE_0}>
                <Progress className="col-8 p-0 pbar-thin"
                  value={this.props.curPairProgress}
                  color="info"
                />
                <BreadCrumbC className="justify-content-center col-8"
                  ancestors={this.props.pairData.breadCrumb.map((id) => this.props.id2Name[id])}
                />
              </PosedFadeY>

              <PosedFadeY key="groupLabel" cDelay={CONST.POSE_DELAY.PHASE_0}>
                <GroupLabel className="mb-5 mt-4 fs-115"
                  pairDataType={this.props.pairData.type}
                  pairDataGId={this.props.pairData.gId}
                  id2Name={this.props.id2Name}
                />
              </PosedFadeY>

              {pairs}
              <PosedFadeY key={this.props.pairData.gId + '_submit'} i={this.props.pairData.pairs.length + 1}>
                <div className="mt--3">
                  <PoseGroup>
                    {this.state.showCrTip ?
                    //Move `mt` to an outer layer to avoid animation cluttering
                    <PosedFade cDelay={100} cDurEx={200} key="crTip">
                      <div className="info-text d-inline-flex">
                        {CONTENT.TIP_BTN.SUBMIT_COMPARISON}
                        <ComponentWTip
                          tipContent={this.state.CRSolution}
                          tippyConfig={{ delay: [50, 50], placement: "top", hideOnClick: false }}>
                          <i className="fas fa-exclamation-circle align-self-end" />
                        </ComponentWTip>
                      </div>
                    </PosedFade> :
                    <PosedNull key="crTip_placeholder">
                      <div className="info-text d-inline-flex invisible">
                        {CONTENT.TIP_BTN.SUBMIT_COMPARISON}
                        <i className="fas fa-exclamation-circle align-self-end" />
                      </div>
                    </PosedNull>}
                  </PoseGroup>
                </div>
                <PosedAttX pose={this.state.pose_submitBtn}>
                  <Button className="btn-wide mt-2" onClick={this.handleComData8Reset}>
                    Submit
                  </Button>
                </PosedAttX>
              </PosedFadeY>
            </PoseGroup>
          </div>
        );
      
      case CONST.COM_TYPE.CONFIRM_POST:
        return (
          <div className="comparison-wrapper mt-4">
            <PoseGroup animateOnMount={true}>
              <PosedFadeY key="breadCrumb" cDelay={CONST.POSE_DELAY.PHASE_0}>
                <Progress className="col-8 p-0 pbar-thin"
                  value={100}
                  color="info"
                />
                <BreadCrumbC className="justify-content-center col-8"
                  ancestors={[""]}
                />
              </PosedFadeY>
              
              <PosedFade key="msg" cDelay={CONST.POSE_DELAY.PHASE_0}>
                <p className="mt-6 fs-115">Required information collected.</p>
              </PosedFade>
              <PosedFadeY key="btn" cDelay={CONST.POSE_DELAY.PHASE_2}>
                <Button className="mt-6 btn-wide" onClick={this.props.exitComparison}>Generate Report</Button>
              </PosedFadeY>
            </PoseGroup>
          </div>
        );

      case CONST.COM_TYPE.NULL:
      default:
        return <div />;
    }
  }


  attSubmitBtn = () => {
    this.setState({ pose_submitBtn: "attention" }, () => {
      util.sleep(300).then(() => {
        this.setState({ pose_submitBtn: "offAttention" });
      });
    });
  };

  genCRSolutionTxt = (compares) => {
    let { targetCompare, targetIndex } = genCRSolution(compares, targetCR);
    if (targetCompare) { //If there's a solution
      let movementModifier = (targetIndex / 2 - 4) === 0 ? '.' : <span>,<br />closer to </span>;
      let movementTarget = (targetIndex / 2 - 4) > 0 ? this.props.id2Name[targetCompare.source] : this.props.id2Name[targetCompare.dest];
      return (
        <div>
          <u>Tip for Adjustment</u><br/>
          Move <b>{this.props.id2Name[targetCompare.dest] + ' or ' + this.props.id2Name[targetCompare.source]}</b>
          {' to ' + Math.abs(targetIndex / 2 - 4)}
          {movementModifier}<b>{movementTarget}</b>.
        </div>
      );
    } else {
      return <div><u>Tip for Adjustment</u><br/>Make your answers less extreme.</div>;
    }
  }

  handleComData8Reset = () => {
    if (this.state.CR > targetCR) { //TODO: adjust back to 0.1, but have to remodel the presentation
      this.attSubmitBtn();
      this.setState({
        showCrTip: true,
        CRSolution: this.genCRSolutionTxt(this.state.compares)
      });
      return;
    }

    let comData = {
      type: this.props.pairData.type,
      gId: this.props.pairData.gId,
      weights: this.state.weights,
      mIndex: this.state.mIndex,
      raw: this.state.compares //For resuming progress
    };
    this.props.handleComData(comData);

    //Reset state
    this.setState({ ...buildDefaultState() });
  };

  updateComData = (data) => {
    this.setState((state) => { //Update uses the current state/prop values requires the function form
      let compares = state.compares.filter((pair) => pair.dest !== data.dest || pair.source !== data.source);
      compares.push(data);

      let [matrix, mIndex] = genMatrix(compares);
      let weights = genWeight(matrix);
      let CR = computeCR(matrix, weights);

      let CRSolution;
      if (state.showCrTip) { //Reduce some computation
        CRSolution = this.genCRSolutionTxt(compares);
      }
      
      return ({
        ...state,
        compares: compares,
        matrix: matrix,
        weights: weights,
        mIndex: mIndex,
        CR: CR,
        CRSolution: CRSolution,
        showCrTip: CR < targetCR ? false : state.showCrTip,
      });
    });
  };
}

Comparison.propTypes = {
  curComparison: PropTypes.string.isRequired, //App state marker
  curPairProgress: PropTypes.number.isRequired, //0-100, the completed percentage (not including this batch)
  handleCriterionFile: PropTypes.func.isRequired, //Deliver the uploaded criterion file to be handled by main
  enterComparison: PropTypes.func.isRequired, //Update graph (app) state, leave pre confirmation
  handleComData: PropTypes.func.isRequired, //Add comData into the store
  exitComparison: PropTypes.func.isRequired, //Update graph (app) state, leave post confirmation
  pairData: PropTypes.exact({
    gId: PropTypes.string, //The id of this pair group, also the parent node's name in the root
    breadCrumb: PropTypes.arrayOf(PropTypes.string), //The ids of the ancestor elements (excluding root)
    pairs: PropTypes.arrayOf(PropTypes.exact({
     source: PropTypes.string,
     dest: PropTypes.string,
     value: PropTypes.number //Will be inserted after comparison
    })), //Multiple pair entries, each with source, dest
    type: PropTypes.string //option or criterion
  }).isRequired,
  id2Name: PropTypes.objectOf(PropTypes.string).isRequired, //A dict translate node id to the name to be displayed
  options: PropTypes.arrayOf(PropTypes.object).isRequired, //Aa array of option items
  nQuestion: PropTypes.number.isRequired //Number of questions the user will encounter
};


export default Comparison;