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


export { genMatrix, genWeight, computeCR };