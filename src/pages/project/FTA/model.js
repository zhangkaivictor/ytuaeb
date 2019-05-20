import modelExtend from 'dva-model-extend'
import { createPostFtaMap, getFtaMap, getAnalyzeTree, getTreeReport } from 'api'
import { pathMatchRegexp,router } from 'utils'
import { pageModel } from 'utils/model'
import { message }from 'antd'

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
          }else {
            router.push({
              pathname: '/post',
            })
            message.info('目前没有项目，请新建！！！');
          }
        }
      })
    },
  },

  effects: {
    * createQuery({ payload = {} }, { call, put }) {
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
    * getTree({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getFtaMap, payload, headers)
      console.log(data)
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
    * getMapAnalyzeTree({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getAnalyzeTree, payload, headers)
      if (data.success) {
        const ftaMapData = yield call(getFtaMap, { projectId: payload.ProjectId }, headers)
        if (data.list.analysisStatus == 'Ok') {
          yield put({
            type: 'querySuccess',
            payload: {
              analyzeList: data.list,
              list: ftaMapData.list,
            },
          })
          alert('分析成功')
        } else {
          alert('分析失败，请联系管理员！！！')
        }
      } else {
        throw data
      }
    },
    * getMapTreeReport({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getTreeReport, payload, headers)
      if (data.success) {
        console.log(payload)
        const ftaMapData = yield call(getFtaMap, payload, headers)
        console.log(data)
        yield put({
          type: 'querySuccess',
          payload: {
            treeReportList: data.list,
            list: ftaMapData.list
          },
        })
        router.push({
          pathname: '/project/FTA/onAnalysis',
          query:payload,
        })
      } else {
        throw data
      }
    },
  },
  reducers: {},
})
