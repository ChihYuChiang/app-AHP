import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import { preprocessNew, preprocessSaved, genRoot, countQuestion } from "../js/pre-data";
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
  curPairProgress: 0,
  nQuestion: 0,
  freshman: true
});
class Main extends Component {
  state = {
    ...buildDefaultState(),
    curControl: CONST.CONTROL_TYPE.NULL,
    curPrompt: CONST.PROMPT_TYPE.NULL,
    curGraph: CONST.GRAPH_TYPE.NULL,
    curComparison: CONST.COM_TYPE.NULL,
    isLoading: false
  };
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
            nQuestion={this.state.nQuestion}
          />
        </div>
        <div className="spacer-150"></div>
        <Footer curComparison={curComparison} />
      </div>
    );
  }

  componentDidMount() {
    if (this.props.match.params.recordId) {
      //Render the specific record graph
      this.fetch8Render(CONST.GRAPH_TYPE.TREE_RECORD);

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
        this.setState({
          prompt: data.prompt,
          option: {
            ...this.state.option,
            ...data.option
          },
          criterion: {
            ...this.state.criterion,
            ...data.criterion
          },
          pairDataGenerator: data.pairDataGenerator,
          curPairData: data.pairDataGenerator.next().value,
          curControl: CONST.CONTROL_TYPE.NULL,
          curPrompt: CONST.PROMPT_TYPE.UPLOAD,
          curGraph: CONST.GRAPH_TYPE.TREE_UPLOAD,
          curComparison: CONST.COM_TYPE.CONFIRM_PRE,
          isLoading: false
        });
      }) //`.then()` uses its cb to create a promise. When this promise resolved, executes next then and creates next promise
      .then(() => {
        this.setState({ nQuestion: countQuestion(this.state.criterion.root, this.state.option.items.length) });
        util.scrollTo(this.controlElement.current.offsetTop - 30);
      });
  }

  handleComData = (comData) => {
    //Accept batch compare data and update App state
    this.setState((state, _) => {
      state[comData.type].compares.push({
        ...comData,
        type: undefined //Remove type property (use undefined would be faster but with potential memory leak)
      });
      state.curPairProgress += state.curPairData.pairs.length / state.nQuestion * 100;
      state.curPairData = state.pairDataGenerator.next().value; //Gen next pairs

      //Shuffle the pair order (for display)
      if (!util.isEmpty(this.state.curPairData)) util.shuffle(state.curPairData.pairs);
      
      //If all pairs are displayed, enter post confirm
      else {
        state.curPairData = {};
        state.curComparison = CONST.COM_TYPE.CONFIRM_POST;
      }

      return state;
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
      curComparison: CONST.COM_TYPE.NULL,
      isLoading: true
    }, async () => { //compute score and produce report
      await util.sleep(2000);

      this.setState((state, _) => {
        let root = score.embedValue(state.criterion.items, state.option.compares, state.criterion.compares);
        state.criterion.root = root;
        state.isLoading = false;
        state.curControl = CONST.CONTROL_TYPE.UPDATE;
        state.curGraph = CONST.GRAPH_TYPE.TREE_UPDATE;
        state.curPrompt = CONST.PROMPT_TYPE.REPORT;

        return state;
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

    let targetPrompt, targetControl, response;
    switch (graphType) {
      default:
      case CONST.GRAPH_TYPE.TREE_DEMO: //TODO: remove the server call; reuse the entry response
        targetPrompt = CONST.PROMPT_TYPE.DEMO;
        targetControl = CONST.CONTROL_TYPE.DEFAULT;
        response = await fetch('/api/demo');
        break;

      case CONST.GRAPH_TYPE.TREE_ENTRY:
        targetPrompt = CONST.PROMPT_TYPE.ENTRY;
        targetControl = CONST.CONTROL_TYPE.DEFAULT;
        response = await fetch('/api/demo');
        break;
      
      case CONST.GRAPH_TYPE.TREE_RECORD:
        targetPrompt = CONST.PROMPT_TYPE.REPORT;
        targetControl = CONST.CONTROL_TYPE.NULL;
        response = await fetch('/api/record/' + this.props.match.params.recordId);
    }

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    let data = {
      graphType: graphType,
      targetPrompt: targetPrompt,
      targetControl: targetControl,
      body: body
    };
    return data;
  };

  renderFetchedResult = (data) => {
    this.setState((state) => {
      //Clear cur state
      state = {
        ...state,
        ...buildDefaultState()
      };
      
      //Retrieve data from the saved entry
      state.prompt = data.body.prompt || {
        text: "Which company to work for?", //TODO: remove the need of fallback
        adjs: ["famous", "nice"]
      };
      state.option.items = data.body.items_option;
      state.criterion.items = data.body.items_criterion;
      state.option.compares = data.body.compares_option;
      state.criterion.compares = data.body.compares_criterion;
      let root = genRoot(data.body.items_criterion);

      //Setup current context
      state.criterion.root = root;
      state.curGraph = data.graphType;
      state.curControl = data.targetControl;
      state.curPrompt = data.targetPrompt;
  
      state.isLoading = false;
  
      return state;
    });

    //When demo, scroll to graph
    if (this.state.curGraph === CONST.GRAPH_TYPE.TREE_DEMO) util.scrollTo(this.controlElement.current.offsetTop - 30);
  };

  recordResult = async () => {
    this.setState({
      curControl: CONST.CONTROL_TYPE.NULL, 
      isLoading: true
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
      curControl: CONST.CONTROL_TYPE.RECORDED, 
      isLoading: false
    });

    return recordId;
  };

  becomeOld = () => {
    this.setState({ freshman: false });
  }
}


export default Main;