const main = {
  LOCATION: {
    AHP: '/',
    SIMPLE: '/simple'
  },
  SIMPLE_STAGE: {
    INPUT: 'input',
    MAGIC: 'magic',
    RESULT: 'result',
    LOADING: 'loading'
  },
  DATA_TYPE: {
    CRITERION: 'criterion',
    OPTION: 'option'
  },
  TIPBTN_TYPE: {
    ALERT: 'alert',
    PROMPT: 'prompt',
    CONFIRM: 'confirm',
  },
  CONTROL_TYPE: {
    UPDATE: 'update',
    DEFAULT: 'default',
    RECORDED: 'recorded',
    NULL: 'null'
  },
  PROMPT_TYPE: {
    UPLOAD: 'upload',
    DEMO: 'demo',
    ENTRY: 'entry',
    REPORT: 'report',
    REPORT_PRE: 'report_pre',
    NULL: 'null'
  },
  GRAPH_TYPE: { //TODO: remove "tree" prefixes
    TREE_UPLOAD: 'tree_upload', //The static graph pre-comparison
    TREE_UPDATE: 'tree_update', //The interactive graph post-comparison
    TREE_DEMO: 'tree_demo',
    TREE_ENTRY: 'tree_entry',
    TREE_RECORD: 'tree_record', //The static graph when retrieving record data
    TREE_REVISE: 'tree_revise', //The static graph when revising the retrieved record data
    NULL: 'null'
  },
  COM_TYPE: {
    REPORT_PRE: 'report_pre',
    CONFIRM_PRE: 'confirm_pre',
    CONFIRM_POST: 'confirm_post',
    COMPARISON: 'comparison',
    NULL: 'null'
  },
  VAL_CMT: {
    EMPTY: 'empty',
    TOO_SHORT: 'too_short',
    TOO_LONG: 'too_long',
    NOT_EQUAL: 'not_equal',
    NOT_ALPHA: 'not_alpha',
    NOT_NUMBER: 'not_number',
    NOT_ALPHA_NUMBER: 'not_alpha_number'
  },
  PATH: {
    TEMPLATE_SERVER: process.env.NODE_ENV === 'production' ? '.' : 'http://localhost:5000'
  }
};


export default main;