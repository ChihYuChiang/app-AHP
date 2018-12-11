import * as d3 from "d3";

import CONST from "./const";
import util from "./util";


async function main(rows) {
  const nRow = rows.length;
  const nCol = rows[0].length;

  //--Option
  //Get data
  let items_option = [];
  for (let i = 2; rows[i][0]; i++) {
    items_option.push({ id: i - 1, name: rows[i][0] });
  }

  //Get pairwise data
  let pairs_option = genPair(items_option);
  pairs_option = pairs_option.map((pair) => ({
    source: pair[0].id + '', //A weird way of converting number to string
    dest: pair[1].id + ''
  }));


  //--Criterion
  //Get hierarchy data
  let items_criterion = [{ id: "0-0", name: "Decision", parent: "", level: 0 }];
  for (let i = 2; i < nRow; i++) {
    for (let j = nCol - 1; j > 0; j--) {
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
    option: {
      items: items_option,
      pairs: pairs_option
    },
    criterion: {
      items: items_criterion,
      pairs: pairs_criterion,
      root: root,
      id2Name: id2Name
    },
    pairDataGenerator: genComPairs(pairs_criterion, root, pairs_option)
  };
}


//Create hierarchy data (the root)
function genRoot(data) {
  return d3
    .stratify()
    .id(function(d) {
      return d.id;
    })
    .parentId(function(d) {
      return d.parent;
    })(data);
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
function* genComPairs(criterionPairs, criterionRoot, optionPairs) { //* for generator
  for (let gId8pairs of Object.entries(criterionPairs)) { //Yield can't be used in forEach callback
    yield ({
      type: CONST.DATA_TYPE.CRITERION,
      gId: gId8pairs[0],
      breadCrumb: getAncestorIds(criterionRoot, gId8pairs[0]),
      pairs: gId8pairs[1]
    });
  }
    
  for (let leaf of criterionRoot.leaves()) {
    yield ({
      type: CONST.DATA_TYPE.OPTION,
      gId: leaf.id,
      breadCrumb: getAncestorIds(criterionRoot, leaf.id),
      pairs: optionPairs
    });
  }
}

function countQuestion(root, nOption) {
  if (!util.isEmpty(root)) {
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


export { main as default, genRoot, countQuestion };
