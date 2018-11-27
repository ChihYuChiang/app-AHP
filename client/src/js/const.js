const main = {
  DATA_TYPE: {
    CRITERION: 'criterion',
    OPTION: 'option'
  },
  GRAPH_TYPE: {
    TREE: 'tree',
    TREE_UPDATE: 'tree_update',
    TREE_DEMO: 'tree_demo'
  },
  PATH: {
    TEMPLATE_SERVER: process.env.NODE_ENV === 'production' ? '.' : 'http://localhost:5000'
  }
}

export default main;