function main(options, magic, problem) {
  let optionScores = options.map(uniScore)
  let magicScore = uniScore(magic);
  let problemScore = uniScore(problem);
  let curDate = new Date().getDate();

  //Sort value from small to large
  //Use concat() to do array shallow copy
  let optionScores_sorted = optionScores.concat().sort((a, b) => a - b);
  
  //Decide based on option, magic, problem, and date
  let targetScore = optionScores_sorted[Math.floor((problemScore + magicScore) / 2 + curDate) % options.length]

  //An id between 0 and options.length
  return optionScores.indexOf(targetScore);
}


//Average Unicode (space removed)
function uniScore(str) {
  str = str.split(' ').join('');
  let sum = str.split('').reduce((acc, cur) => {
    acc += cur.charCodeAt(0);
    return acc;
  }, 0)
  let avg = sum / str.length
  return avg
}


export default main;