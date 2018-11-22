function genPair(data) {
  let combination = [];

  data.forEach((a, ia) => {
    combination.push(...data.map((b, ib) => (ia < ib ? [a, b] : null)));
  });
  //Filter undefined
  combination = combination.filter(c => c);

  return combination;
}

function genMatrix(compares) {
  let mIndex = new Set();
  compares.forEach((compare) => {mIndex.add(compare.dest); mIndex.add(compare.source);});
  mIndex = Array.from(mIndex);

  let matrix = Array.from({ length: mIndex.length }, (_) => new Array(mIndex.length).fill(1)); //Array.fill() creates only shallowcopy and can't be used here
  //-8 to 8, 0 means equal
  //0 -> 1; 8 -> 9; -8 -> 1/9
  function translate(value) {
    if (value >= 0) return value + 1;
    else return 1 / (-value + 1);
  }
  compares.forEach((compare) => {
    let translatedValue = translate(compare.value);
    matrix[mIndex.indexOf(compare.source)][mIndex.indexOf(compare.dest)] = translatedValue;
    matrix[mIndex.indexOf(compare.dest)][mIndex.indexOf(compare.source)] = 1 / translatedValue;
  });

  return [matrix, mIndex];
}

//Reverse normalize (Ref p237)
function genWeight(matrix) {
  let weights = matrix.reduce(
    (acc, cur) => acc.map((_, i) => acc[i] + cur[i]),
    new Array(matrix.length).fill(0)
  );
  weights = weights.map(w => 1 / w);
  let sum = weights.reduce((acc, cur) => acc + cur, 0);
  weights = weights.map(i => i / sum);

  return weights;
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

function computeScore(matrix, weights) {
  let scores = matrix.map((row) => {
    let tmp = row.reduce((acc, cur, j) => {
      return acc + cur * weights[j];
    }, 0)
    return tmp;
  });
  return scores;
}


let test = [[1, 3, 7], [1 / 3, 1, 5], [1 / 7, 1 / 5, 1]];
let test2 = [[1, 1/6, 0.2], [6, 1, 2], [5, 0.5, 1]];
let test3 = [[1, 9, 7], [1/9, 1, 1/5], [1/7, 5, 1]];
let index = ["a", "b", "c"];

let test4 = [
  {source: "a", dest: "b", value: 4},
  {source: "a", dest: "c", value: 6},
  {source: "a", dest: "d", value: 1},
  {source: "b", dest: "c", value: 5},
  {source: "b", dest: "d", value: 2},
  {source: "c", dest: "d", value: 4}
]
let gg = genMatrix(test4)[0]
console.log(gg)
// console.log(computeScore(test3, genWeight(test3)))
// console.log(test[0][1])
// console.log(test[index.indexOf('b')][index.indexOf('b')])


export { genPair, genMatrix, genWeight, computeCR };