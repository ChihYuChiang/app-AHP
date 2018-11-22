import * as d3 from "d3";
import { genPair } from "./pairMatrix"; //Have to ad ./ or it is deemed as a module

async function main(rows) {
  const nRow = rows.length;
  const nCol = rows[0].length;


  //--Option
  //Get data
  let items = [];
  for (let i = 1; rows[i][0]; i++) {
    items.push({ id: i, name: rows[i][0] });
  }

  //Get pairwise data
  let pairs_option = genPair(items);
  pairs_option = pairs_option.map((pair) => ({
    source: pair[0].id + '', //A weird way of converting number to string
    dest: pair[1].id + ''
  }));


  //--Criterion
  //Get hierarchy data
  function searchParent(i, j) {
    if (j === 1) {
      return "0-0";
    } else if (rows[i][j - 1]) {
      return i + "-" + (j - 1);
    } else {
      return searchParent(i - 1, j);
    }
  }
  let data = [{ id: "0-0", name: "root", parent: "" }];
  for (let i = 1; i < nRow; i++) {
    for (let j = nCol - 1; j > 0; j--) {
      if (rows[i][j]) {
        data.push({
          id: i + "-" + j,
          name: rows[i][j],
          parent: searchParent(i, j)
        });
      }
    }
  }
  let root = d3
    .stratify()
    .id(function(d) {
      return d.id;
    })
    .parentId(function(d) {
      return d.parent;
    })(data);

  //Identify graph boundary
  root.dx = 30;
  root.dy = 500 / (root.height + 1);
  let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
  treeLayout(root);

  //Get pairwise data and id to name dict
  let pairs_criterion = {};
  let id2Name = {};
  function extract(obj) {
    id2Name[obj.id] = obj.data.name;
    
    if (obj.children) {
      obj.children.map(extract);
      
      if (obj.children.length > 1) {
        let ids = obj.children.map((c) => c.id);
        let pairs = genPair(ids);
        pairs = pairs.map((pair) => ({
          source: pair[0],
          dest: pair[1]
        }));
        pairs_criterion[obj.id] = pairs;
      }
    }
  }
  extract(root);


  //--Return
  return {
    option: {
      items: items,
      pairs: pairs_option
    },
    criterion: {
      root: root,
      pairs: pairs_criterion,
      id2Name: id2Name
    },
    pairsGenerator: genComPairs(pairs_criterion, root, pairs_option)
  };
}

function* genComPairs(criterionPairs, criterionRoot, optionPairs) { //Generator
  for (let gId8pairs of Object.entries(criterionPairs)) { //Yield can't be used in forEach callback
    yield ({
      type: 'criterion',
      gId: gId8pairs[0],
      pairs: gId8pairs[1]
    });
  }
    
  for (let leaf of criterionRoot.leaves()) {
    yield ({
      type: 'option',
      gId: leaf.id,
      pairs: optionPairs
    });
  }
}

export default main;
