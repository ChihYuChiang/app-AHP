const main = {
  LOCATION: {
    AHP: 'AHP',
    SIMPLE: 'simple'
  },
  DATA_TYPE: {
    CRITERION: 'criterion',
    OPTION: 'option'
  },
  GRAPH_TYPE: {
    TREE_UPLOAD: 'tree_upload',
    TREE_UPDATE: 'tree_update',
    TREE_DEMO: 'tree_demo',
    TREE_ENTRY: 'tree_entry',
    TREE_RECORD: 'tree_record',
    COMPARISON: 'comparison',
    NULL: 'null'
  },
  CONTROL_TYPE: {
    UPDATE: 'update',
    DEFAULT: 'default',
    NULL: 'null'
  },
  GRAPH_MEASURE: {
    BAR_HEIGHT: 67,
    BAR_WIDTH: 100,
    LEGEND_ITEM_HEIGHT: 22
  },
  PATH: {
    TEMPLATE_SERVER: process.env.NODE_ENV === 'production' ? '.' : 'http://localhost:5000'
  }
}


export default main;