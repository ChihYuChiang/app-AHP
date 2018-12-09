import React from "react";


const main = {
  TIP_BTN: {
    DEMO_RESULT:
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
      </div>
  },
  TIP_OTHER: {
    A_ESCAPE_SIMPLE: "Let's not bother with the complicated reality.."
  },
  INSTRUCTION: {
    SIMPLE: "Remember, to make this really works, answer the question sincerely."
  },
  SUBTITLE: {
    SIMPLE:
      `
      This is a simple decision maker that makes life much easier.
      Fill up your problem, options, and a little magic question, and you'll know the way you should go.
      `,
    AHP:
      `
      The analytic hierarchy process (AHP) is a structured technique for organizing and analyzing complex decisions, based on mathematics and psychology. 
      It was developed by Thomas L. Saaty in the 1970s and has been extensively studied and refined since then.
      `
  },
  MAGIC_PROMPTS: [
    ["Name a celebrity off the top of your head.", "While you are following {}'s news,"],
    ["Name a politician off the top of your head.", "While you have seen so much about {},"],
    ["Name a major brand you like.", "While you like {} products,"],
    ["What's your favorite color?", "While you like {} color,"],
    ["What's your favorite fruit?", "While you eat {} often,"],
    ["What's your favorite movie? (accept TV series as well)", "While you love {},"],
    ["Use one word to describe today's weather.", "While it's {} today,"],
    ["Use one word to describe your current mood.", "While you are feeling {},"],
    ["Who do you like more, Donald or Hillary?", "While you think {} is a bit better,"],
    ["Are people born good or bad?", "While we are naturally {},"]
  ]
}


export default main;