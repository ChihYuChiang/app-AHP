//String distance based on average Unicode
function main(options, magic) {
  let optionScores = options.map(uniScore);
  let magicScore = uniScore(magic);
  let optionDistances = optionScores.map((optionScore) => Math.abs(optionScore - magicScore));

  let recId = optionDistances.reduce((acc, _, i, array) => {
    return array[i] <= array[acc] ? i : acc;
  }, 0)
  return recId;
}


//Average Unicode 
function uniScore(str) {
  let sum = str.split('').reduce((acc, cur) => {
    acc += cur.charCodeAt(0);
    return acc;
  }, 0)
  let avg = sum / str.length
  return avg
}


export default main;