import React, { Component } from "react";
import readXlsxFile from "read-excel-file";

import preprocessData, { genRoot, countQuestion } from "../js/pre-data";
import util from "../js/util";
import score from "../js/score";
import CONST from "../js/const";

import Comparison from "./comparison";
import Graph from "./graph";
import Control from "./control";
import { Header, Footer } from "./header-footer";
import { Loading } from "./util";


const buildDefaultState = () => ({
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
  curPairData: {}
});


class Main extends Component {
  state = {
    ...buildDefaultState(),
    curGraph: CONST.GRAPH_TYPE.NULL,
    curControl: CONST.CONTROL_TYPE.NULL,
    isLoading: false
  };

  render() {
    return ( //TODO: input the underlying problem
      <div className="container">
        <div className="col-12" align="center">
          <div className="spacer-100"></div>
          <Header location={CONST.LOCATION.AHP} />
          <div className="mt-4">
            <Control
              curControl={this.state.curControl}
              renderDemoGraph={() => {this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_DEMO);}}
              recordResult={this.recordResult}
            />
          </div>
          <div className="content mt-4">
            <Loading isLoading={this.state.isLoading} />
            <Graph
              curGraph={this.state.curGraph}
              root={this.state.criterion.root}
              options={this.state.option.items}
            />
            <Comparison
              enterComparison={this.enterComparison}
              handleComData={this.handleComData}
              pairData={this.state.curPairData}
              id2Name={this.state.criterion.id2Name}
              options={this.state.option.items}
              nQuestion={countQuestion(this.state.criterion.root, this.state.option.items.length)}
            />
          </div>
          <Footer />
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
      this.fetch8RenderGraph(CONST.GRAPH_TYPE.TREE_ENTRY).then(() => {
        //TODO: deal with the bad file input listener
        //Listen to file input
        const input = document.getElementById("inputCriterionFile");
        input.addEventListener("change", () => {
          readXlsxFile(input.files[0])
            .then(preprocessData)
            .then(async (data) => {
              this.setState({
                curGraph: CONST.GRAPH_TYPE.NULL,
                isLoading: true
              });
              await util.sleep(1000);
              return data;
            })
            .then((data) => { //items, root, pairs, id2Name, generator
              this.setState({
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
                curGraph: CONST.GRAPH_TYPE.TREE_UPLOAD,
                curControl: CONST.CONTROL_TYPE.NULL,
                isLoading: false
              });
            });
        });
      });
    }
  }


  handleComData = (comData) => {
    //Accept batch compare data and update App state
    this.setState((state, _) => {
      state[comData.type].compares.push({
        ...comData,
        type: undefined //Remove type property (use undefined would be faster but with potential memory leak)
      });
      state.curPairData = state.pairDataGenerator.next().value; //Gen next pairs
      if (!util.isEmpty(this.state.curPairData)) util.shuffle(state.curPairData.pairs); //Shuffle the pair order (for display)

      return state;
    }, async () => {
      //If all pairs are displayed, compute score and produce report
      if (util.isEmpty(this.state.curPairData)) {
        //Fake loading
        this.setState({
          curGraph: CONST.GRAPH_TYPE.NULL,
          isLoading: true
        });
        await util.sleep(2000);
  
        this.setState((state, _) => {
          let root = score.embedValue(state.criterion.items, state.option.compares, state.criterion.compares);
          state.criterion.root = root;
          state.curGraph = CONST.GRAPH_TYPE.TREE_UPDATE;
          state.curControl = CONST.CONTROL_TYPE.UPDATE;
          state.isLoading = false;
  
          return state;
        });
      }
    });
  };

  enterComparison = () => {
    this.setState({
      curGraph: CONST.GRAPH_TYPE.COMPARISON,
      curControl: CONST.CONTROL_TYPE.NULL
    });
  };

  fetch8RenderGraph = async (graphType) => {
    //Hide graph and display loading spinner
    this.setState({ curGraph: CONST.GRAPH_TYPE.NULL, isLoading: true });

    var response, targetControl;
    switch (graphType) {
      default:
      case CONST.GRAPH_TYPE.TREE_DEMO:
      case CONST.GRAPH_TYPE.TREE_ENTRY:
        response = await fetch('/api/demo');
        targetControl = CONST.CONTROL_TYPE.DEFAULT;
        break;
      
      case CONST.GRAPH_TYPE.TREE_RECORD:
        response = await fetch('/api/record/' + this.props.match.params.recordId);
        targetControl = CONST.CONTROL_TYPE.NULL;
    }

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    this.setState((curState) => {
      //Clear cur state
      curState = {
        ...curState,
        ...buildDefaultState()
      };
  
      curState.option.items = body.items_option;
      curState.criterion.items = body.items_criterion;
      let root = genRoot(body.items_criterion);
      curState.criterion.root = root;
      curState.curGraph = graphType;
      curState.curControl = targetControl;
  
      curState.isLoading = false;
  
      return curState;
    });
  };

  recordResult = async () => {
    this.setState({ isLoading: true });

    const response = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items_criterion: this.state.criterion.items,
        items_option: this.state.option.items,
        compares_criterion: this.state.criterion.compares,
        compares_option: this.state.option.compares
      }),
    });
    const recordId = await response.text();

    this.setState({ isLoading: false });
    return recordId;
  };
}


export default Main;