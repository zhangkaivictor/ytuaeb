import modelExtend from 'dva-model-extend'
import { queryPostList, createPost, updatePost, queryUserList } from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'fta',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/FTA', location.pathname)) {
          dispatch({
            type: 'query',
            payload: {
              status: 2,
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    * query({ payload = {} }, { call, put }) {
      const headers = {
        'Authorization': window.localStorage.getItem('token')
      };
      const data = yield call(queryPostList, payload, headers)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
            },
          },
        })
      } else {
        throw data
      }
    },
  },

  reducers: {}

})
