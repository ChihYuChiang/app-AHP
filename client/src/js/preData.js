import * as d3 from "d3";

import CONST from "./const";


async function main(rows) {
  const nRow = rows.length;
  const nCol = rows[0].length;

  //--Option
  //Get data
  let items_option = [];
  for (let i = 1; rows[i][0]; i++) {
    items_option.push({ id: i, name: rows[i][0] });
  }

  //Get pairwise data
  let pairs_option = genPair(items_option);
  pairs_option = pairs_option.map((pair) => ({
    source: pair[0].id + '', //A weird way of converting number to string
    dest: pair[1].id + ''
  }));


  //--Criterion
  //Get hierarchy data
  let items_criterion = [{ id: "0-0", name: "Root", parent: "", level: 0 }];
  for (let i = 1; i < nRow; i++) {
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

function searchParent(rows, i, j) {
  if (j === 1) {
    return "0-0";
  } else if (rows[i][j - 1]) {
    return i + "-" + (j - 1);
  } else {
    return searchParent(rows, i - 1, j);
  }
}

function genPair(data) {
  let combination = [];

  data.forEach((a, ia) => {
    combination.push(...data.map((b, ib) => (ia < ib ? [a, b] : null)));
  });
  //Filter undefined
  combination = combination.filter(c => c);

  return combination;
}

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

function* genComPairs(criterionPairs, criterionRoot, optionPairs) { //Generator
  for (let gId8pairs of Object.entries(criterionPairs)) { //Yield can't be used in forEach callback
    yield ({
      type: CONST.DATA_TYPE.CRITERION,
      gId: gId8pairs[0],
      pairs: gId8pairs[1]
    });
  }
    
  for (let leaf of criterionRoot.leaves()) {
    yield ({
      type: CONST.DATA_TYPE.OPTION,
      gId: leaf.id,
      pairs: optionPairs
    });
  }
}

export { main as default, genRoot };
