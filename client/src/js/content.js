import React from "react";


const main = {
  TIP_BTN: {
    DEMO_REPORT:
      <div>
        This shows what we'll have after the <b>AHP procedure</b>,
        which evaluates the importance of each <b>decision criterion</b> and the performance of each <b>option</b>.
      </div>,
    DOWNLOAD_TEMPLATE:
      <div>
        Download an Excel <b>template file</b>, which
        we can edit directly and upload by <b>Upload Your Criteria</b> to continue the AHP procedure.
      </div>,
    UPLOAD_CRITERIA:
      <div>
        The criteria have to be edited in an <b>Excel file</b> in a particular format.
        Please refer to the template file via <b>Download Template</b>.
      </div>,
    RECORD_REPORT:
      <div>
        This will save your report, this entire interactive graph, to the <b>cloud</b> and give you an <b>unique URL</b> to share and access this report in any later time.
      </div>
  },
  TIP_OTHER: {
    A_ESCAPE_SIMPLE: "Let's not bother with the complicated reality.."
  },
  INSTRUCTION: {
    SIMPLE: "Remember, to make this really works, answer the question sincerely.",
    COM_CRITERION:
      <div>
        <p><b>0</b> - the two criteria are <b>equally</b> important</p>
        <p><b>1</b> - this criterion is <b>moderately</b> more important than the opposite one</p>
        <p><b>2</b> - this criterion is <b>strongly</b> more important than the opposite one</p>
        <p><b>3</b> - this criterion is <b>very strongly</b> more important than the opposite one</p>
        <p><b>4</b> - this criterion is <b>extremely</b> more important than the opposite one</p>        
      </div>,
    COM_OPTION:
      <div>
        <p><b>0</b> - the two options perform <b>equally</b> well</p>
        <p><b>1</b> - this option performs <b>moderately</b> better than the opposite one</p>
        <p><b>2</b> - this option performs <b>strongly</b> better than the opposite one</p>
        <p><b>3</b> - this option performs <b>very strongly</b> better than the opposite one</p>
        <p><b>4</b> - this option performs <b>extremely</b> better than the opposite one</p>        
      </div>,
    STEP_INTRO: "AHP is a powerful technique but at the same time complex and arduous to implement. It employs knowledge of Linear Algebra, cumbersome questionnaire logistics, and series of matrix computations. This app handles all these technical details for you and streamlines AHP into 3 simple steps:",
    STEP_1: "Download the template of the options and criteria and follow the template's instructions modifying its content according to your problem at hand.",
    STEP_2: "Upload your personalized options and criteria.",
    STEP_3: "Answer a few questions regarding your options and criteria. Follow the questions and walk through each aspects and alternatives worth considering.",
    STEP_4: "Get the evaluative report generated for your decision.",
    INTERPRET: ""
  },
  SUBTITLE: {
    SIMPLE:
      `
      This is a simple decision maker that makes life much easier.
      Fill up your problem, options, and a little magic question, and you'll know the way you should go.
      `,
    AHP:
      <div>
        <p>
          This app implements the <a href="https://en.wikipedia.org/wiki/Analytic_hierarchy_process" target="_blank" rel="noopener noreferrer">analytical hierarchy process (AHP)</a> for decision making in complex situations, such as whether to accept a business offer, to hire a candidate, or to change your career track.
        </p>
        <p>
          Based on mathematics and psychology, AHP is a structured technique developed by <a href="https://en.wikipedia.org/wiki/Thomas_L._Saaty" target="_blank" rel="noopener noreferrer">Thomas L. Saaty</a> for organizing and analyzing complex decisions, especially ones with manifold review criteria. It is widely used in compounded business contexts and can also be applied in complicated individual matters. 
        </p>
      </div>
  },
  MAGIC_PROMPTS: [
    ["Name a celebrity off the top of your head.", "While you've followed {}'s activity"],
    ["Name a politician off the top of your head.", "While you have seen so much about {}"],
    ["Name a major brand you like.", "While you like {}'s products"],
    ["What's your favorite color?", "While you like {} color"],
    ["What's your favorite fruit?", "While you eat {} often"],
    ["What's your favorite movie? (accept TV series as well)", "While you love {}"],
    ["Use one word to describe today's weather.", "While it's {} today"],
    ["Use one word to describe your current mood.", "While you feel {} today"],
    ["Who do you like more, Donald or Hillary?", "While you think {} is a bit better"],
    ["Are people born good or bad?", "While we are naturally {}"]
  ]
}


export default main;