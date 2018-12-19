import React from "react";


const main = {
  TIP_BTN: {
    DEMO_RESULT:
      <div>
        This shows what we'll have after the <b>AHP procedure</b>.
      </div>,
    DOWNLOAD_TEMPLATE:
      <div>
        Download an <b>Excel</b> template file.
        You can edit it directly and upload it by the <b>Upload Your Criteria</b> button to start the AHP procedure.
      </div>,
    UPLOAD_CRITERIA:
      <div>
        Start the AHP procedure by uploading decision options and criteria. 
        They have to be in an <b>Excel</b> file of a particular format.
        Please acquire the template by the <b>Download Template</b> button.
      </div>,
    RECORD_REPORT:
      <div>
        This saves your report to the cloud and produces an unique <b>URL</b> for later access.
      </div>
  },
  TIP_OTHER: {
    A_ESCAPE_SIMPLE: "Let's not bother with the complicated reality..",
    CARD_PROMPT_CONTENT:
      <div>
        <p>This is a sample decision to be made.</p>
          The <b>decision criteria</b> are presented in the graph.
          From left to right, criteria contain sub-criteria
          and gets more specific and detailed along the paths.
      </div>
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
    STEP_INTRO:
      <div>
        <p>The AHP is powerful but complex. This app handles all the technical difficulties you'll encounter when implementing the AHP and streamlines the process into 4 simple steps.</p>
      </div>,
    STEP_1: "Download the template for decision options and criteria. Follow the template's instruction and modify its content.",
    STEP_2: "Upload your personalized options and criteria.",
    STEP_3: "Answer questions regarding the options and criteria.",
    STEP_4: "Acquire your AHP report.",
    INTERPRET:
      <ul>
        <li>Your report will be presented in a form of tree graph where each node represents a decision criterion. The nodes are connected to show their hierarchical relations. In addition, the <b>size of a node</b> represents how important is this criterion to the evaluation.</li>
        <li>The <b>Decision node</b> summarizes consideration of all criteria and is the summary of your report. Its color shows the <b>final recommended option</b> by the AHP for your underlying decision.</li>
        <li>Each color in the graph represents one option. The <b>color of a node</b> represents the dominant option regarding that particular criterion. In addition, the more <b>colorful</b> (less pale) a node is, the more dominant that dominant option is.</li>
        <li>Click the items in the <b>legend</b> to filter criteria by their dominant option.</li>
        <li>Move your cursor over a node, you'll see the actual <b>percentage</b> this criteria represents in the consideration, which is reflected in the size of the nodes. You'll also be able to observe <b>bar charts</b> that show each option's performance (in a percentage score) regarding this criterion. The option with the highest score will dominate (occupy) this node, and this node will be colored by the same color of that option.</li>
      </ul>
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