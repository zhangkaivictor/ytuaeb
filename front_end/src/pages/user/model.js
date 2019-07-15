/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import {
  queryUserList,
  createUser,
  updateUser,
  changePassword
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/user', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const headers = {
        'Authorization': window.localStorage.getItem('token')
      };
      const data = yield call(queryUserList, payload, headers)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
    *search({ payload },{ call, put }){
      yield put({
        type: 'querySuccess',
        payload: {
          list: payload.searchDate,
          pagination: {
            current: Number(payload.page) || 1,
            pageSize: Number(payload.pageSize) || 10,
          },
        },
      })
    },

    *change({ payload }, { call, put, select }) {
      const headers = {
        'Authorization': window.localStorage.getItem('token')
      };
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(changePassword, newUser, headers)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const headers = {
        'Authorization': window.localStorage.getItem('token')
      };
      const data = yield call(createUser, payload, headers)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const headers = {
        'Authorization': window.localStorage.getItem('token')
      };
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(updateUser, newUser, headers)
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
