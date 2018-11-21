import * as d3 from "d3";
import { genPair } from "./util"; //Have to ad ./ or it is deemed as a module

async function main(rows) {
  const nRow = rows.length;
  const nCol = rows[0].length;

  //--Get options
  let options = [];
  for (let i = 1; rows[i][0]; i++) {
    options.push({ id: i, name: rows[i][0] });
  }


  //--Get hierarchy data
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
  console.log(root);

  //Identify graph boundary
  root.dx = 30;
  root.dy = 500 / (root.height + 1);
  let treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
  treeLayout(root);


  //--Get pairwise data
  let pairData = {};
  function extract(obj) {
    if (obj.children) {
      obj.children.map(extract);
      
      if (obj.children.length > 1) {
        let ids = obj.children.map((c) => c.id);
        let pairs = genPair(ids);
        pairs = pairs.map((pair) => ({
          source: pair[0],
          dest: pair[1]
        }));
        pairData[obj.id] = (pairs);
      }
    }
  }
  extract(root);

  return {
    option: {
      items: [],
      pairs: []
    },
    criterion: {
      root: root,
      pairs: pairData
    }
  };
}

export default main;
