import * as d3 from "d3"; //TODO: include only used modules
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import isEmpty from "lodash/isEmpty";

import { rand2Adjs } from "../js/random-decision";
import util from "./util";
import CONST from "./const";


export function preprocessNew(rows) { //The excel module removes empty row or column
  //--Prompt
  let prompt = rows[0][1];


  //--Option
  //Get data
  let items_option = rows[1].filter((i) => !isNull(i));
  items_option.shift(); //Remove the "option" title
  items_option = items_option.map((item, i) => ({id: i + 1, name: item})); //id starts from 1
  
  //Get pairwise data
  let pairs_option = genPair(items_option);
  pairs_option = pairs_option.map((pair) => ({
    source: pair[0].id + '', //A weird way of converting number to string
    dest: pair[1].id + ''
  }));


  //--Criterion
  //Get hierarchy data
  const nRow = rows.length - 2; //The area of the criteria input (including the 'criteria' title column)
  const nCol = Math.max(...rows.slice(2).map((row) => {
    let nullLen = row.reduceRight((acc, cur) => { //Count how many null appended at the end of each row
      if (acc[1]) {
        if (isNull(cur)) acc[0]++
        else acc[1] = false;
      }
      return acc;
    }, [0, true])[0];
    let contentLen = row.length - nullLen;
    return contentLen;
  }));
  let items_criterion = [{ id: "0-0", name: "Decision", parent: "", level: 0 }];
  for (let i = 2; i < nRow + 2; i++) {
    for (let j = nCol; j > 0; j--) {
      if (rows[i][j]) {
        items_criterion.push({
          id: i + "-" + j,
          name: rows[i][j],
          parent: searchParent(rows, i, j),
          level: j
        });
      }
    }
  }
  let root = genRoot(items_criterion);

  //Get pairwise data and id to name dict
  let [pairs_criterion, id2Name] = extractPairs(root);


  //--Return
  return {
    prompt: {
      text: prompt,
      adjs: rand2Adjs(items_option, prompt)
    },
    option: {
      items: items_option
    },
    criterion: {
      items: items_criterion,
      root: root,
      id2Name: id2Name
    },
    pairDataGenerator: genComPairs({
      root: root,
      pairs_criterion: pairs_criterion,
      pairs_option: pairs_option
    })
  };
}

export function preprocessSaved(data) {
  //--Option
  //Get pairwise data
  let pairs_option = genPair(data.body.items_option);
  pairs_option = pairs_option.map((pair) => ({
    source: pair[0].id + '', //A weird way of converting number to string
    dest: pair[1].id + ''
  }));


  //--Criterion
  //Get root
  let root = genRoot(data.body.items_criterion);

  //Get pairwise data and id to name dict
  let [pairs_criterion, id2Name] = extractPairs(root);
  

  //--Return
  return {
    prompt: data.body.prompt || {
      text: "Which company to work for?", //TODO: remove the need of fallback
      adjs: ["famous", "nice"]
    },
    option: {
      items: data.body.items_option,
      compares: data.body.compares_option
    },
    criterion: {
      items: data.body.items_criterion,
      compares: data.body.compares_criterion,
      root: root,
      id2Name: id2Name
    },
    pairDataGenerator: genComPairs({
      root: root,
      pairs_criterion: pairs_criterion,
      pairs_option: pairs_option,
      compares_criterion: data.body.compares_criterion,
      compares_option: data.body.compares_option
    })
  };
}


//Create hierarchy data (the root)
export function genRoot(data) {
  return d3
    .stratify()
    .id(function(d) {
      return d.id;
    })
    .parentId(function(d) {
      return d.parent;
    })(data);
}

export function countQuestion(root, nOption) {
  if (!isEmpty(root)) {
    let optionQ = root.leaves().length * util.combinations(nOption, 2);
    let criterionQ = 0;
    for (let node of root.descendants()) {
      if (node.children !== undefined && node.children.length >= 2) {
        criterionQ += util.combinations(node.children.length, 2);
      }
    }
    return optionQ + criterionQ;
  } else return "";
}


//Identify parent item in the xlsx structure
function searchParent(rows, i, j) {
  if (j === 1) {
    return "0-0";
  } else if (rows[i][j - 1]) {
    return i + "-" + (j - 1);
  } else {
    return searchParent(rows, i - 1, j);
  }
}

//Get the node obj
function getNodeById(root, id) {
  let allNodes = root.descendants();
  return allNodes.filter((item) => item.id === id)[0];
}

//Get ancestor ids (only ids) of a node id
function getAncestorIds(root, id) {
  let targetNode = getNodeById(root, id);
  let ancestorNodes = targetNode.ancestors();
  let ancestorIds = ancestorNodes.map((node) => node.id);
  return ancestorIds;
}

//Generate pairs from an array
function genPair(data) {
  let combination = [];

  data.forEach((a, ia) => {
    combination.push(...data.map((b, ib) => (ia < ib ? [a, b] : null)));
  });
  //Filter undefined
  combination = combination.filter(c => c);

  return combination;
}

//Generate pairs from a root obj
function extractPairs(root) {
  let pairsObj = {};
  let id2Name = {};

  let extractPair = (obj) => {
    id2Name[obj.id] = obj.data.name;
    
    if (obj.children) {
      obj.children.map(extractPair);
      
      if (obj.children.length > 1) {
        let ids = obj.children.map((c) => c.id);
        let pairs = genPair(ids);
        pairs = pairs.map((pair) => ({
          source: pair[0],
          dest: pair[1]
        }));
        pairsObj[obj.id] = pairs;
      }
    }
  }
  extractPair(root);

  return [pairsObj, id2Name];
}

//A generator prepares all info to be used in AHP comparison stage
function* genComPairs(data) { //* for generator
  //Retrieve recorded data from `compares` if there's any
  for (let gId8pairs of Object.entries(data.pairs_criterion)) { //Yield can't be used in forEach callback
    yield ({
      type: CONST.DATA_TYPE.CRITERION,
      gId: gId8pairs[0],
      breadCrumb: getAncestorIds(data.root, gId8pairs[0]),
      pairs: isUndefined(data.compares_criterion) ?
        gId8pairs[1] :
        data.compares_criterion.filter((comData) => comData.gId === gId8pairs[0])[0].raw
    });
  }
    
  for (let leaf of data.root.leaves()) {
    yield ({
      type: CONST.DATA_TYPE.OPTION,
      gId: leaf.id,
      breadCrumb: getAncestorIds(data.root, leaf.id),
      pairs: isUndefined(data.compares_option) ?
        data.pairs_option :
        data.compares_option.filter((comData) => comData.gId === leaf.id)[0].raw
    });
  }
}