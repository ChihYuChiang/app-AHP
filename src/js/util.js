function genPair(data) {
  let combination = [];

  data.forEach((a, ia) => {
    combination.push(...data.map((b, ib) => (ia < ib ? [a, b] : null)));
  });
  //Filter undefined
  combination = combination.filter(c => c);

  return combination;
}

function genMatrix(pair) {}

//Reverse normalize (Ref p237)
function genWeight(matrix) {
  let weights = matrix.reduce(
    (acc, cur) => acc.map((_, i) => acc[i] + cur[i]),
    new Array(matrix.length).fill(0)
  );
  weights = weights.map(w => 1 / w);
  let sum = weights.reduce((acc, cur) => acc + cur, 0);
  weights = weights.map(i => i / sum);

  return weights
}

function computeCR(matrix, weights) {
  let lambda = matrix.map((row, i) => {
    let tmp = row.reduce((acc, cur, j) => {
      return acc + cur * weights[j];
    }, 0);
    return tmp / weights[i];
  })
  let CI = ((lambda.reduce((acc, cur) => acc + cur, 0) / matrix.length) - matrix.length) / (matrix.length - 1);
  const RIs = [null, null, null, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.53, 1.56, 1.57, 1.58];
  let CR = CI / RIs[matrix.length]
  return CR;
}

function computeScore(cMatrix, weights) {
  let scores = cMatrix.map((row) => {
    let tmp = row.reduce((acc, cur, j) => {
      return acc + cur * weights[j];
    }, 0)
    return tmp;
  });
  return scores;
}


let test = new Array(3).fill(new Array(3).fill(1));
test = [[1, 3, 7], [1 / 3, 1, 5], [1 / 7, 1 / 5, 1]];
let test2 = [[1, 1/6, 0.2], [6, 1, 2], [5, 0.5, 1]];
let test3 = [[1, 9, 7], [1/9, 1, 1/5], [1/7, 5, 1]];
let index = ["a", "b", "c"];

console.log(computeScore(test3, genWeight(test3)))
// console.log(test[0][1])
// console.log(test[index.indexOf('b')][index.indexOf('b')])

export { genPair };