import { genRoot } from './preData';


class main {
  
  static embedValue(data, optCom, criCom) {
    //Dict for node name -> id in data
    let dIndex = {};
    data.forEach((d, i) => {dIndex[d.id] = i;});


    //--Weight
    for (let compare of criCom) {
      compare.mIndex.forEach((d, i) => {
        data[dIndex[d]].weight = compare.weights[i];
      });
    }
    //Fill 100% weight if the criterion is not compared (has no compare data)
    for (let d of data) {
      d.weight = d.weight || 1;
    }


    //--Score
    //Leaves
    for (let compare of optCom) {
      let sortedWeights = [];
      //Sort the scores by option id (1 to max)
      for (let i = 1; i <= compare.weights.length; i++) {
        sortedWeights.push(compare.weights[compare.mIndex.indexOf(i + '')]); //Index are str
      }
      data[dIndex[compare.gId]].score = sortedWeights;
    }

    
    //--Weighted score
    //Sort higher level to the higher index
    data.sort((a, b) => b.level - a.level);

    //Propagate to middle nodes
    for (let i = 0; i < data.length; i++) {
      if (data[i].score == null) { //Check both undefined and null
        let children = data.filter((d) => d.parent === data[i].id);
        let sMatrix = children.map((child) => child.score.map((s) => s * child.weight));
        data[i].score = sMatrix.reduce((acc, cur) => acc.map((a, i) => a + cur[i]), new Array(sMatrix[0].length).fill(0));
      }
    }

    let root = genRoot(data);
    return root;
  }

}

export default main;