import React, { Component } from "react";
import { Button } from 'reactstrap';
import { PoseGroup } from 'react-pose';

import { DivPosedFadeY } from './pose';
import BreadCrumbC from './breadcrumb';

import { genMatrix, genWeight, computeCR } from "../js/com-matrix";
import CONST from "../js/const";
import styles from "../scss/variable.scss";


class Comparison extends Component {
  /*
    props = {
      curComparison //App state marker
      handleCriterionFile //Deliver the uploaded criterion file to be handled by main
      enterComparison //Update graph (app) state
      handleComData //Add comData into the store
      pairData
      //.gId, The id of this pair group, also the parent node's name in the root
      //.breadCrumb, The ids of the ancestor elements (excluding root)
      //.pairs, Multiple pair entries, each with source, dest
      //.type, option or criterion
      id2Name //A dict translate node id to the name to be displayed
      options //Aa array of option items
      nQuestion //Number of questions the user will encounter
    }
  */
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
          <div className="col-8">
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
            <Button className="btn-medium mr-5" onClick={this.confirmCriteria}>Confirm</Button>
            <Button className="btn-medium">
              <label htmlFor="fileInput-criteria" className="file-label">
                Modify
              </label>
            </Button>
          </div>
          //TODO: after confirm, a fake loading stage
        );
      
      case CONST.COM_TYPE.COMPARISON:
        //TODO: progress bar
        //TODO: hide submit after each submit
        let pairs = this.props.pairData.pairs.map((pair, i) => ( //`key` is for both array React Components and Pose identification; `i` is for staggering delay
          <DivPosedFadeY key={this.props.pairData.gId + '_' + pair.source + '_' + pair.dest} i={i} delay={150}>
            <Pair
              type={this.props.pairData.type}
              data={pair}
              updateComData={this.updateComData}
              id2Name={this.props.id2Name}
              options={this.props.options}
            />
          </DivPosedFadeY>
        ));
    
        return ( //animateOnMount=true lets the first element mounted being animated (it's mounted along with the PoseGroup and will not be animated by default)
          <div className="comparison mt-4">
            <BreadCrumbC className="justify-content-center col-8"
              ancestors={this.props.pairData.breadCrumb.map((id) => this.props.id2Name[id])}
            />
            <GroupLabel className="mb-5 mt-4 fs-115"
              pairDataType={this.props.pairData.type}
              pairDataGId={this.props.pairData.gId}
              id2Name={this.props.id2Name}
            />
            <PoseGroup animateOnMount={true}>
              {pairs}
            </PoseGroup>
            <Button className="mt-2 btn-wide" onClick={this.handleComData8Reset}>Submit</Button>
          </div>
        );
      
      case CONST.COM_TYPE.CONFIRM_POST:
      case CONST.COM_TYPE.NULL:
      default:
        //TODO:--After answering questions, a fake confirmation stage
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
  }

  updateComData = (value, data) => {
    data.value = value;
    this.setState((curState) => { //Update uses the current state/prop values requires the function form
      let compares = curState.compares.filter((pair) => pair.dest !== data.dest || pair.source !== data.source);
      compares.push(data);
      curState.compares = compares;
      return curState;
    });
  }

  confirmCriteria = () => {
    this.setState({ confirmed: true });
    this.props.enterComparison();
  }
}


function GroupLabel(props) {
  /*
    props = { //As in the parent
      pairDataType
      pairDataGId
      id2Name
      className
    }
  */
  if (props.pairDataType === CONST.DATA_TYPE.CRITERION) {
    return (
      <p className={props.className}>
        {"Regarding "}
        <span className="text-primary">
          {props.pairDataGId === "0-0" ? "the base criteria" : props.id2Name[props.pairDataGId]}
        </span>
        {", what is more important?"}
      </p>
    );
  } else {
    return (
      <p className={props.className}>
        {"Regarding "}
        <span className="text-primary">
          {props.id2Name[props.pairDataGId]}
        </span>
        {", which option has advantage?"}
      </p>
    );
  }
}


class Pair extends Component {
  /*
    props = {
      data //A pair data, with source, dest
      updateComData //Update the comData state in the parent company
      id2Name //A dict translate node id to the name to be displayed
      options //Aa array of option items
    }
  */
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

    return ( //TODO: sticky score explanation
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


export default Comparison;