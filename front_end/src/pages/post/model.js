import modelExtend from 'dva-model-extend'
import {
  queryPostList,
  createPost,
  updatePost,
  queryUserList,
  queryPostTypeList,
} from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'post',

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/post', location.pathname)) {
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
    *query({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      if (payload.type == undefined) {
        payload.type = 'WorkProject'
      }
      const data = yield call(queryPostTypeList, payload, headers)
      if (data.success) {
        const usersData = yield call(queryUserList, {}, headers)
        if (usersData.success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.list,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
              },
              userList: usersData.list,
            },
          })
        }
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(createPost, payload, headers)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'app/query' })
      } else {
        throw data
      }
    },
    *update({ payload }, { select, call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const newUser = payload
      const data = yield call(updatePost, newUser, headers)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
