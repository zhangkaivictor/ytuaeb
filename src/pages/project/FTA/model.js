import modelExtend from 'dva-model-extend'
import { createPostFtaMap, getFtaMap, getAnalyzeTree } from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'FTA',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/project/FTA', location.pathname)) {
          if (location.query.projectId != undefined) {
            dispatch({
              type: 'getTree',
              payload: {
                projectId: location.query.projectId,
              },
            })
          }
        }
      })
    },
  },

  effects: {
    *createQuery({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(createPostFtaMap, payload, headers)
      if (data.success) {
        console.log(data)
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
          },
        })
      } else {
        throw data
      }
    },
    *getTree({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getFtaMap, payload, headers)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
          },
        })
      } else {
        throw data
      }
    },
    *getMapAnalyzeTree({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      console.log(payload)
      const data = yield call(getAnalyzeTree, payload, headers)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
          },
        })
      } else {
        throw data
      }
    },
  },
  reducers: {},
})
