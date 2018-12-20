import CONTENT from "./content";


//TODO: change name, dont use default main
function main(options, magic, problem) {
  let optionScores = options.map(uniScore);
  let magicScore = uniScore(magic);
  let problemScore = uniScore(problem);
  let curDate = new Date().getDate();
  let curDay = new Date().getDay();

  //Sort value from small to large
  //Use concat() to do array shallow copy
  let optionScores_sorted = optionScores.concat().sort((a, b) => a - b);
  
  //Decide based on option, magic, problem, date, and day
  let targetScore = optionScores_sorted[(problemScore + magicScore + curDate * curDay) % options.length];

  //An id between 0 and options.length
  return optionScores.indexOf(targetScore);
}

function rand2Adjs(options, prompt) {
  let optionScores = uniScore(options.reduce((acc, cur) => acc + cur.name, ""));
  let promptScore = uniScore(prompt);
  let curDate = new Date().getDate();
  let curDay = new Date().getDay();

  let adjIds = [(optionScores + curDate * curDay) % CONTENT.ADJECTIVES.length, (promptScore + curDate * curDay) % CONTENT.ADJECTIVES.length];

  //Alter duplication
  let [adjIds_rDupe, dupe] = [adjIds, false];
  do {
    [adjIds_rDupe, dupe] = adjIds_rDupe.reduce((acc, cur, _) => {
      if (acc[0].includes(cur)) {
        acc[1] = true;
        acc[0].push(CONTENT.ADJECTIVES.length === cur + 1 ? 0 : cur + 1);
      }
      else acc[0].push(cur);

      return acc;
    }, [[], false]);
  } while (dupe);
  
  let adjs = [
    CONTENT.ADJECTIVES[adjIds_rDupe[0]], //From options
    CONTENT.ADJECTIVES[adjIds_rDupe[1]] //From prompt
  ];

  return adjs;
}


//Aggregate Unicode (space removed)
function uniScore(str) {
  str = str.split(' ').join('');
  let sum = str.split('').reduce((acc, cur) => {
    acc += cur.charCodeAt(0);
    return acc;
  }, 0);
  return sum;
}


export { rand2Adjs, main as default };