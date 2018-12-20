import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import preprocessData, { genRoot, countQuestion } from "../js/pre-data";
import util from "../js/util";
import score from "../js/score";
import CONST from "../js/const";

import Comparison from "./comparison";
import Graph from "./graph";
import Control from "./control";
import Prompt from "./prompt";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";


const buildDefaultState = () => ({
  prompt: {
    text: "",
    adjs: ["", ""]
  },
  option: {
    items: [],
    pairs: [],
    compares: []
  },
  criterion: {
    items: [],
    pairs: {},
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

  render() {
    return ( //TODO: input the underlying problem
      <div className="container">
        <div className="col-12" align="center">
          <div className="spacer-100"></div>
          <Header location={CONST.LOCATION.AHP} />
          <div className="mt-7">
            <Control
              curControl={this.state.curControl}
              handleCriterionFile={this.handleCriterionFile}
              renderDemoGraph={() => {this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_DEMO);}}
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
          <Footer location={CONST.LOCATION.AHP} />
          <div className="spacer-150"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.match.params.recordId) {
      //Render the specific record graph
      this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_RECORD);

    } else {
      //Render entry graph
      this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_ENTRY);
    }
  }


  handleCriterionFile = (file) => {
    readXlsxFile(file)
      .then(preprocessData)
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
      .then((data) => { //prompt, items, root, pairs, id2Name, generator
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
        this.setState({ nQuestion: countQuestion(this.state.criterion.root, this.state.option.items.length) })
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
    });
  };

  fetch8RenderGraph = async (graphType) => {
    //Hide graph and display loading spinner
    this.setState({
      curGraph: CONST.GRAPH_TYPE.NULL,
      curPrompt: CONST.PROMPT_TYPE.NULL,
      curComparison: CONST.COM_TYPE.NULL,
      isLoading: true
    });

    var response, targetControl, targetPrompt;
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
        response = await fetch('/api/record/' + this.props.match.params.recordId);
        targetControl = CONST.CONTROL_TYPE.NULL;
        targetPrompt = CONST.PROMPT_TYPE.REPORT;
    }

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    this.setState((state) => {
      //Clear cur state
      state = {
        ...state,
        ...buildDefaultState()
      };
      
      state.prompt = body.prompt || {
        text: "Which company to work for?", //TODO: remove the need of fallback
        adjs: ["famous", "nice"]
      };
      state.option.items = body.items_option;
      state.criterion.items = body.items_criterion;
      let root = genRoot(body.items_criterion);

      state.criterion.root = root;
      state.curGraph = graphType;
      state.curControl = targetControl;
      state.curPrompt = targetPrompt;
  
      state.isLoading = false;
  
      return state;
    });
  };

  recordResult = async () => {
    this.setState({
      curControl: CONST.CONTROL_TYPE.NULL, 
      isLoading: true
    });

    const response = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: this.state.prompt,
        items_criterion: this.state.criterion.items, //To recreate the graph, we need only items, which contain scores and can recreates root
        items_option: this.state.option.items
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