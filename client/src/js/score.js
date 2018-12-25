import { genRoot } from './pre-data';
import isEmpty from "lodash/isEmpty";


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


    //--Partitioned weight
    function getParWeight (datum) {
      if (datum.parent === "") return 1; //root
      else return datum.weight * getParWeight(data.filter((d) => d.id === datum.parent)[0]);
    }
    for (let d of data) {
      d.parWeight = getParWeight(d);
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
      if (isEmpty(optCom.filter((compare) => compare.gId === data[i].id))) {
        let children = data.filter((d) => d.parent === data[i].id);
        let sMatrix = children.map((child) => child.score.map((s) => s * child.weight));
        data[i].score = sMatrix.reduce((acc, cur) => acc.map((a, i) => a + cur[i]), new Array(sMatrix[0].length).fill(0));
      }
    }

    console.log(data)
    let root = genRoot(data);
    return root;
  }

}

export default main;