import modelExtend from 'dva-model-extend'
import { getProjectContent, linkProject, unLinkProject } from 'api'
import { pathMatchRegexp, router } from 'utils'
import { pageModel } from 'utils/model'
import { message } from 'antd'

// import { st} from
export default modelExtend(pageModel, {
  namespace: 'VARS',
  state: {
    projectContent: null,
    activeNode: null,
    selectForAdd: [],
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
      console.log(data)
      if (data.success) {
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
      }
    },
    *addProjectLink({ payload = {} }, { call, put, select }) {
      const projects = yield select(state => state.VARS.selectForAdd)
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      let data = null
      for (let i = 0; i < projects.length; i++) {
        let payload = {
          linkedProjectId: projects[i],
          workProjectId: workProjectId,
        }
        data = yield call(linkProject, payload, headers)
      }
      console.log(data)
      if (data.success) {
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
        let node = yield select(state => state.VARS.activeNode)
        console.log(node)
        if (node.type == 'fmea') {
          yield put({
            type: 'selectTreeNode',
            payload: {
              type: 'fmea',
              files: data.list.fmeaProjects,
            },
          })
        } else {
          yield put({
            type: 'selectTreeNode',
            payload: {
              type: 'fta',
              files: data.list.ftaProjects,
            },
          })
        }
      }
    },
    *unBindProject({ payload = {} }, { call, put, select }) {
      console.log(payload)
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      let dd = {
        linkedProjectId: payload.id,
        workProjectId: workProjectId,
      }
      console.log(dd)
      const data = yield call(unLinkProject, dd, headers)
      console.log(data)
      if (data.success) {
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
      }
      let node = yield select(state => state.VARS.activeNode)
      console.log(node)
      if (node.type == 'fmea') {
        yield put({
          type: 'selectTreeNode',
          payload: {
            type: 'fmea',
            files: data.list.fmeaProjects,
          },
        })
      } else {
        yield put({
          type: 'selectTreeNode',
          payload: {
            type: 'fta',
            files: data.list.ftaProjects,
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
        selectForAdd: [],
        activeNode: payload,
      }
    },
    addProject(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        selectForAdd: payload.projects,
      }
    },
  },
})
