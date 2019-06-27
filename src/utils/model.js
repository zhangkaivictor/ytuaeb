import modelExtend from 'dva-model-extend'

export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    projectLists: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const {
        list,
        pagination,
        userList,
        analyzeList,
        treeReportList,
        projectLists,
      } = payload
      return {
        ...state,
        list,
        analyzeList,
        treeReportList,
        projectLists,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        userList,
      }
    },
  },
})
