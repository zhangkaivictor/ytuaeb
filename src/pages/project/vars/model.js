import modelExtend from 'dva-model-extend'
import { getProjectContent } from 'api'
import { pathMatchRegexp, router } from 'utils'
import { pageModel } from 'utils/model'
import { message } from 'antd'

// import { st} from
export default modelExtend(pageModel, {
  namespace: 'VARS',
  state: {
    projectContent: null,
    activeNode: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/project/VARS', location.pathname)) {
          if (location.query.projectId != undefined) {
            dispatch({
              type: 'getWorkProjectContent',
              payload: {
                projectId: location.query.projectId,
                path: 'Root',
                searchOption: 1,
              },
            })
          } else {
            router.push({
              pathname: '/post',
            })
            message.info('目前没有项目，请新建！！！')
          }
        }
      })
    },
  },
  effects: {
    // *postFmea({ payload = {} }, { call, put }) {
    //   const headers = {
    //     Authorization: window.localStorage.getItem('token'),
    //   }
    //   console.log(payload)
    //   const data = yield call(postFmeaData, payload, headers)
    //   console.log(data)
    //   if (data.success) {
    //     // yield put({
    //     //   type: 'querySuccess',
    //     //   payload: {
    //     //     list: data.list,
    //     //   },
    //     // })
    //   } else {
    //     throw data
    //   }
    // },
    *getWorkProjectContent({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getProjectContent, payload, headers)
      if (data.success) {
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
      }
    },
  },
  reducers: {
    projectContent(state, { payload }) {
      return {
        ...state,
        projectContent: payload.list,
      }
    },
    selectTreeNode(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        activeNode: payload,
      }
    },
  },
})
