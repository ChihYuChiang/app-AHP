import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Progress } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFade, PosedFadeY } from './pose';
import { GroupLabel, Pair } from './comparison_label-pair';
import BreadCrumbC from './breadcrumb';

import { genMatrix, genWeight, computeCR } from "../js/com-matrix";
import CONST from "../js/const";


//TODO: replace the slider bar form
//TODO: save comparison for each page, when leaving, prompt  https://docs.mongodb.com/manual/core/index-ttl/
//TODO: a tree to be able to click, to go back and modify
//TODO: implement CR
class Comparison extends Component {
  state = {
    compares: [] //Store the pair data and comparison result
  }

  render() {
    switch (this.props.curComparison) {

      case CONST.COM_TYPE.REPORT_PRE:
        return (
          <div className="comparison-wrapper col-8">
            <p className="mt--3 fs-85">
              Choose to modify the input or go directly to the report.
            </p>
            <Button className="btn-medium mr-5" onClick={this.props.enterComparison}>Modify Input</Button>
            <Button className="btn-medium">Generate Report</Button>
          </div>
        );

      case CONST.COM_TYPE.CONFIRM_PRE:
        //Present a rounded int to 10th digit
        let nQuestion = this.props.nQuestion <= 10 ? 10 : Math.round(this.props.nQuestion / 10) * 10;
        let secPerQ = 8; //Time estimate for 1 question
        let nMin = Math.round(this.props.nQuestion * secPerQ / 60) === 0 ? 1 : Math.round(this.props.nQuestion * secPerQ / 60);
        
        return (
          <div className="comparison-wrapper col-8">
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
            <Button className="btn-medium">
              <label htmlFor="fileInput-criteria" className="file-label">
                Modify
              </label>
            </Button>
          </div>
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
              <PosedFadeY key="breadCrumb">
                <Progress className="col-8 p-0 pbar-thin"
                  value={this.props.curPairProgress}
                  color="info"
                />
                <BreadCrumbC className="justify-content-center col-8"
                  ancestors={this.props.pairData.breadCrumb.map((id) => this.props.id2Name[id])}
                />
              </PosedFadeY>

              <PosedFadeY key="groupLabel">
                <GroupLabel className="mb-5 mt-4 fs-115"
                  pairDataType={this.props.pairData.type}
                  pairDataGId={this.props.pairData.gId}
                  id2Name={this.props.id2Name}
                />
              </PosedFadeY>

              {pairs}
              <PosedFadeY key={this.props.pairData.gId + '_submit'} i={this.props.pairData.pairs.length + 1}>
                <Button className="mt-4 btn-wide" onClick={this.handleComData8Reset}>Submit
                </Button>
              </PosedFadeY>
            </PoseGroup>
          </div>
        );
      
      case CONST.COM_TYPE.CONFIRM_POST:
        return (
          <div className="comparison-wrapper mt-4">
            <PoseGroup animateOnMount={true}>
              <PosedFadeY key="breadCrumb">
                <Progress className="col-8 p-0 pbar-thin"
                  value={100}
                  color="info"
                />
                <BreadCrumbC className="justify-content-center col-8"
                  ancestors={[""]}
                />
              </PosedFadeY>
              
              <PosedFade key="msg">
                <p className="mt-6 fs-115">Required information collected.</p>
              </PosedFade>
              <PosedFadeY key="btn" cDelay={1000}>
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


  handleComData8Reset = () => {
    let [matrix, mIndex] = genMatrix(this.state.compares);
    let weights = genWeight(matrix);
    let CR = computeCR(matrix, weights);

    let comData = {
      type: this.props.pairData.type,
      gId: this.props.pairData.gId,
      weights: weights,
      mIndex: mIndex,
      raw: this.state.compares //For resuming progress
    };

    this.props.handleComData(comData);
    this.setState({ compares: [] });
  };

  updateComData = (value, data) => {
    data.value = value;
    this.setState((curState) => { //Update uses the current state/prop values requires the function form
      let compares = curState.compares.filter((pair) => pair.dest !== data.dest || pair.source !== data.source);
      compares.push(data);
      curState.compares = compares;
      return curState;
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