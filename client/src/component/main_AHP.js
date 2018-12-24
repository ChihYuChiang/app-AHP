import React, { Component } from "react";
import readXlsxFile from "read-excel-file";
import isEmpty from "lodash/isEmpty";

import { preprocessNew, preprocessSaved, countQuestion } from "../js/pre-data";
import util from "../js/util";
import score from "../js/score";
import CONST from "../js/const";

import { Header, Footer } from "./header-footer";
import Comparison from "./comparison";
import Graph from "./graph";
import Control from "./control";
import Prompt from "./prompt";
import { Loading } from "./util";


const buildDefaultState = () => ({
  //Data states here
  prompt: {
    text: "",
    adjs: ["", ""]
  },
  option: {
    items: [],
    compares: []
  },
  criterion: {
    items: [],
    compares: [],
    root: {},
    id2Name: {}
  },
  pairDataGenerator: {},
  curPairData: {},
  curPairProgress: 0
});
class Main extends Component {
  //Marker states here
  state = {
    ...buildDefaultState(),
    curControl: CONST.CONTROL_TYPE.NULL,
    curPrompt: CONST.PROMPT_TYPE.NULL,
    curGraph: CONST.GRAPH_TYPE.NULL,
    curComparison: CONST.COM_TYPE.NULL,
    isLoading: false,
    freshman: true
  };
  nQuestion = 0;
  recordId = this.props.match.params.recordId;
  controlElement = React.createRef(); //For routing prompt, preventing accidental leaving the page

  render() {
    let { curComparison } = this.state;

    return (
      <div className="container" align="center">
        <Header />
        <div className="mt-7" ref={this.controlElement}>
          <Control
            curControl={this.state.curControl}
            handleCriterionFile={this.handleCriterionFile}
            renderDemoGraph={() => {this.fetch8Render(CONST.GRAPH_TYPE.TREE_DEMO);}}
            recordResult={this.recordResult}
            freshman={this.state.freshman}
            becomeOld={this.becomeOld}
          />
        </div>
        <div className="content mt-4">
          <Loading isLoading={this.state.isLoading} />
          <Prompt
            curPrompt={this.state.curPrompt}
            prompt={this.state.prompt}
          />
          <Graph
            curGraph={this.state.curGraph}
            root={this.state.criterion.root}
            options={this.state.option.items}
          />
          <Comparison
            curComparison={this.state.curComparison}
            curPairProgress={this.state.curPairProgress}
            handleCriterionFile={this.handleCriterionFile}
            enterComparison={this.enterComparison}
            handleComData={this.handleComData}
            exitComparison={this.exitComparison}
            pairData={this.state.curPairData}
            id2Name={this.state.criterion.id2Name}
            options={this.state.option.items}
            nQuestion={this.nQuestion}
          />
        </div>
        <div className="spacer-150"></div>
        <Footer curComparison={curComparison} />
      </div>
    );
  }

  componentDidMount() {
    if (this.recordId) {
      //Render the specific record graph
      this.fetch8Render(CONST.GRAPH_TYPE.TREE_RECORD);
      this.setState({ freshman: false }); //Return users are not freshman

    } else {
      //Render entry graph
      this.fetch8Render(CONST.GRAPH_TYPE.TREE_ENTRY);
    }

    //Prevent accidental leaving when working on long comparison
    window.addEventListener('beforeunload', this.handleLeaving)
  }

  componentWillUnmount() { //Unmount the listener for simple version
    window.removeEventListener("beforeunload", this.handleLeaving);
  }


  handleLeaving = (evt) => {
    if ([CONST.COM_TYPE.COMPARISON, CONST.COM_TYPE.CONFIRM_POST].includes(this.state.curComparison)) {
      //Cancel the leaving event
      evt.preventDefault();
      //Chrome requires returnValue to be set
      evt.returnValue = '';
    }
  };

  handleCriterionFile = (file) => {
    readXlsxFile(file)
      .then(preprocessNew)
      .then(async (data) => {
        this.setState({
          curGraph: CONST.GRAPH_TYPE.NULL,
          curPrompt: CONST.PROMPT_TYPE.NULL,
          curComparison: CONST.COM_TYPE.NULL,
          isLoading: true
        });
        await util.sleep(1000);
        return data;
      })
      .then((data) => { //prompt, items, root, id2Name, generator
        this.nQuestion = countQuestion(data.criterion.root, data.option.items.length);
        this.setState((state) => ({
          //Reset data states
          ...state,
          ...buildDefaultState(),

          //Update data states 
          prompt: data.prompt,
          option: { ...buildDefaultState().option, ...data.option },
          criterion: { ...buildDefaultState().criterion, ...data.criterion },
          pairDataGenerator: data.pairDataGenerator,

          //Update marker states
          curPairData: data.pairDataGenerator.next().value,
          curControl: CONST.CONTROL_TYPE.NULL,
          curPrompt: CONST.PROMPT_TYPE.UPLOAD,
          curGraph: CONST.GRAPH_TYPE.TREE_UPLOAD,
          curComparison: CONST.COM_TYPE.CONFIRM_PRE,
          isLoading: false
        }));
      }) //`.then()` uses its cb to create a promise. When this promise resolved, executes next then and creates next promise
      .then(() => {
        util.scrollTo(this.controlElement.current.offsetTop - 30);
      });
  }

  handleComData = (comData) => {
    //Accept batch compare data and update App state
    this.setState((state) => {
      let newState = { ...state };
      
      newState[comData.type].compares = newState[comData.type].compares.filter((element) => element.gId !== comData.gId);
      newState[comData.type].compares.push({
        ...comData,
        type: undefined //Remove type property (use undefined would be faster but with potential memory leak)
      });
      newState.curPairProgress += state.curPairData.pairs.length / this.nQuestion * 100;
      newState.curPairData = state.pairDataGenerator.next().value; //Gen next pairs

      if (isEmpty(newState.curPairData)) {
        newState.curPairData = {};
        newState.curComparison = CONST.COM_TYPE.CONFIRM_POST;
      }

      return newState;
    });

    util.scrollTo(this.controlElement.current.offsetTop - 20, "auto");
  };

  enterComparison = () => { //From pre confirm into real comparison
    this.setState({
      //Fake loading
      curGraph: CONST.GRAPH_TYPE.NULL,
      curPrompt: CONST.PROMPT_TYPE.NULL,
      curComparison: CONST.COM_TYPE.NULL,
      isLoading: true
    }, async () => {
      await util.sleep(1500);

      //Update the real content
      this.setState({
        curComparison: CONST.COM_TYPE.COMPARISON,
        isLoading: false
      });

      util.scrollTo(this.controlElement.current.offsetTop - 20);
    });
  };

  exitComparison = () => { //From post confirm (showing 100% progress) into report 
    this.setState({
      curPrompt: CONST.PROMPT_TYPE.NULL,
      curGraph: CONST.GRAPH_TYPE.NULL,
      curComparison: CONST.COM_TYPE.NULL,
      isLoading: true
    }, async () => { //compute score and produce report
      await util.sleep(2000);

      this.setState((state) => {
        let root = score.embedValue(state.criterion.items, state.option.compares, state.criterion.compares);
        
        return {
          ...state,
          criterion: {
            ...state.criterion,
            root: root
          },
          isLoading: false,
          curControl: CONST.CONTROL_TYPE.UPDATE,
          curGraph: CONST.GRAPH_TYPE.TREE_UPDATE,
          curPrompt: CONST.PROMPT_TYPE.REPORT
        };
      });

      util.scrollTo(this.controlElement.current.offsetTop - 30);
    });
  };

  fetch8Render = (graphType) => {
    this.fetchRecordedResult(graphType)
      .then(this.renderFetchedResult);
  };

  fetchRecordedResult = async (graphType) => {
    //Hide graph and display loading spinner
    this.setState({
      curGraph: CONST.GRAPH_TYPE.NULL,
      curPrompt: CONST.PROMPT_TYPE.NULL,
      curComparison: CONST.COM_TYPE.NULL,
      isLoading: true
    });

    //Fake a certain loading time before return
    //`await` later to let the promise run along side the `fetch` call
    let sleeper = util.sleep(1000);

    let targetPrompt, targetControl, targetComparison, response;
    switch (graphType) {
      default:
      case CONST.GRAPH_TYPE.TREE_DEMO: //TODO: remove the server call; reuse the entry response
        targetPrompt = CONST.PROMPT_TYPE.DEMO;
        targetControl = CONST.CONTROL_TYPE.DEFAULT;
        targetComparison = CONST.COM_TYPE.NULL;
        response = await fetch('/api/demo');
        break;

      case CONST.GRAPH_TYPE.TREE_ENTRY:
        targetPrompt = CONST.PROMPT_TYPE.ENTRY;
        targetControl = CONST.CONTROL_TYPE.DEFAULT;
        targetComparison = CONST.COM_TYPE.NULL;
        response = await fetch('/api/demo');
        break;
      
      case CONST.GRAPH_TYPE.TREE_RECORD:
        targetPrompt = CONST.PROMPT_TYPE.REPORT_PRE;
        targetControl = CONST.CONTROL_TYPE.NULL;
        targetComparison = CONST.COM_TYPE.REPORT_PRE;
        response = await fetch('/api/record/' + this.recordId);
    }

    const parser = response.json();
    
    //Await here to ensure the loading time is at least a certain amount of time
    let body = await parser;
    await sleeper;

    if (response.status !== 200) throw Error(body.message);

    let data = {
      graphType: graphType,
      targetPrompt: targetPrompt,
      targetControl: targetControl,
      targetComparison: targetComparison,
      body: body
    };

    return data;
  };

  renderFetchedResult = (data) => {
    let data_processed = preprocessSaved(data);
    let curPairData = data_processed.pairDataGenerator.next().value;

    this.nQuestion = countQuestion(data_processed.criterion.root, data_processed.option.items.length);

    this.setState((state) => ({
      //Reset data states
      ...state,
      ...buildDefaultState(),
      
      //Update data states
      ...data_processed,
      curPairData: curPairData,

      //Update marker states
      curGraph: data.graphType,
      curControl: data.targetControl,
      curPrompt: data.targetPrompt,
      curComparison: data.targetComparison,
      isLoading: false
    }));

    //When demo, scroll to graph
    if ([CONST.GRAPH_TYPE.TREE_DEMO].includes(this.state.curGraph)) {
      util.scrollTo(this.controlElement.current.offsetTop - 30);
    }
  };

  recordResult = async () => {
    this.setState({
      isLoading: true,
      curPrompt: CONST.PROMPT_TYPE.NULL,
      curGraph: CONST.GRAPH_TYPE.NULL,
    });

    const response = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ //TODO: sync the format with what in the state
        prompt: this.state.prompt,
        items_criterion: this.state.criterion.items, //To recreate the graph, we need only items, which contain scores and can recreates root
        items_option: this.state.option.items,
        compares_criterion: this.state.criterion.compares, //For resuming progress
        compares_option: this.state.option.compares
      }),
    });
    const recordId = await response.text();

    this.setState({
      isLoading: false,
      curControl: CONST.CONTROL_TYPE.RECORDED,
      curPrompt: CONST.PROMPT_TYPE.REPORT,
      curGraph: CONST.GRAPH_TYPE.TREE_UPDATE,
    });

    return recordId;
  };

  becomeOld = () => {
    this.setState({ freshman: false });
  };
}


export default Main;