//Compute score for middle nodes
function computeScore(matrix, weights) {
  let scores = matrix.map((row) => {
    let tmp = row.reduce((acc, cur, j) => {
    return acc + cur * weights[j];
    }, 0);
    return tmp;
  });
  return scores;
}

//Acquire score for leaf from comData, compute score for middle nodes
function embedWeight(root, optCom, criCom) {
  
}

export { computeScore, embedWeight };