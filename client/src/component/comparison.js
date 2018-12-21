import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Button, Progress } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { PosedFade, PosedFadeY, PosedExpandY, PosedRotate180 } from './pose';
import BreadCrumbC from './breadcrumb';

import { genMatrix, genWeight, computeCR } from "../js/com-matrix";
import CONST from "../js/const";
import CONTENT from "../js/content";
import styles from "../scss/variable.scss";


//TODO: take note for each comparison
//TODO: save comparison for each page, when leaving, prompt  https://docs.mongodb.com/manual/core/index-ttl/
//TODO: a tree to be able to click, to go back and modify
//TODO: implement CR
class Comparison extends Component {
  state = {
    compares: [] //Store the pair data and comparison result
  }

  render() {
    switch (this.props.curComparison) {

      case CONST.COM_TYPE.CONFIRM_PRE:
        //Present a rounded int to 10th digit
        let nQuestion = this.props.nQuestion <= 10 ? 10 : Math.round(this.props.nQuestion / 10) * 10;
        let secPerQ = 8;
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
                <div ref={(ref) => {this.ref_progressBar = ref;}} />
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

    this.props.handleComData({
      type: this.props.pairData.type,
      gId: this.props.pairData.gId,
      weights: weights,
      mIndex: mIndex
    });
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


class GroupLabel extends Component {
  state = {
    instructExpand: true //Control showing or hiding the score explanation
  };

  render() {
    let flipper = (
      <PosedRotate180 pose={this.state.instructExpand ? "upright" : "upSideDown"} className="expand-flipper">
        <i className="fas fa-caret-down fs-115" onClick={this.toggleInstruct} />
      </PosedRotate180>
    );

    if (this.props.pairDataType === CONST.DATA_TYPE.CRITERION) {
      return (
        <div className={this.props.className}>
          <div>
            {"Regarding "}
            <span className="text-primary">
              {this.props.pairDataGId === "0-0" ? "the base criteria" : this.props.id2Name[this.props.pairDataGId]}
            </span>
            <span className="mr-sucker">
              {", what is more important?"}
            </span>
            {flipper}
          </div>
          <PosedExpandY pose={this.state.instructExpand ? "expanded" : "collapsed"}>
            <div className="instruction">
              {CONTENT.INSTRUCTION.COM_CRITERION}
            </div>
          </PosedExpandY>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}>
          <div>
            {"Regarding "}
            <span className="text-primary">
              {this.props.id2Name[this.props.pairDataGId]}
            </span>
            <span className="mr-sucker">
              {", which option has advantage?"}
            </span>
            {flipper}
          </div>
          <PosedExpandY pose={this.state.instructExpand ? "expanded" : "collapsed"}>
            <div className="instruction">
              {CONTENT.INSTRUCTION.COM_OPTION}
            </div>
          </PosedExpandY>          
        </div>
      );
    }
  }


  toggleInstruct = () => {
    this.setState({ instructExpand: !this.state.instructExpand });
  };
}

GroupLabel.propTypes = { //As in the parent
  pairDataType: PropTypes.string.isRequired,
  pairDataGId: PropTypes.string.isRequired,
  id2Name: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.string
};


class Pair extends Component { //TODO: better comparison format? tip when sliding?
  state = {
    value: 0
  };

  sliderElement = React.createRef();
  labelElement = React.createRef();
  
  render() {
    let sourceName = this.props.type === CONST.DATA_TYPE.CRITERION
      ? this.props.id2Name[this.props.data.source]
      : this.props.options.filter((op) => op.id + '' === this.props.data.source)[0].name;
    let destName = this.props.type === CONST.DATA_TYPE.CRITERION
      ? this.props.id2Name[this.props.data.dest]
      : this.props.options.filter((op) => op.id + '' === this.props.data.dest)[0].name;

    return (
      <div>
        <p>{destName}<span className="text-secondary ml-2 mr-2">or</span>{sourceName}</p>
        <div>
          <input name="range-slider" type="range" className="fluid-slider" max="8" min="-8" step="1"
            data-source={sourceName}
            data-dest={destName}
            value={this.state.value}
            onChange={this.handleChange}
            onInput={this.genSliderLabel}
            ref={this.sliderElement}
            />
          <span className="range-label" ref={this.labelElement}>{Math.abs(this.state.value) / 2}</span>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    this.props.updateComData(this.state.value, this.props.data); //Set default comData (if not changed by user)
    this.genSliderLabel(); //Set default presentation
  }

  genSliderLabel = () => {
    let sliderElement = this.sliderElement.current;
    let labelElement = this.labelElement.current;
    let labelPosition = (sliderElement.value - sliderElement.min) / (sliderElement.max - sliderElement.min);
  
    labelElement.style.left = labelPosition * (styles.sliderWidth - 19) - 120 + "px";
  }
  
  handleChange = (event) => { //Arrow functions always gets the context from where they have been defined.
    this.setState({ value: +event.target.value }, () => {
      this.props.updateComData(this.state.value, this.props.data);
    });
  }
}

Pair.propTypes = {
  data: PropTypes.exact({
    source: PropTypes.string.isRequired,
    dest: PropTypes.string.isRequired,
    value: PropTypes.number //Will be inserted after comparison
  }).isRequired,  //A pair data, with source, dest
  updateComData: PropTypes.func.isRequired, //Update the comData state in the parent company
  id2Name: PropTypes.objectOf(PropTypes.string).isRequired, //A dict translate node id to the name to be displayed
  options: PropTypes.arrayOf(PropTypes.object).isRequired //Aa array of option items
};


export default Comparison;