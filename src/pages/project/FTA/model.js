import modelExtend from 'dva-model-extend'
import { createPostFtaMap, getFtaMap, getAnalyzeTree, getTreeReport } from 'api'
import { pathMatchRegexp, router } from 'utils'
import { pageModel } from 'utils/model'
import { message } from 'antd'

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
    *createQuery({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(createPostFtaMap, payload, headers)
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
      const data = yield call(getAnalyzeTree, payload, headers)
      if (data.success) {
        const ftaMapData = yield call(
          getFtaMap,
          { projectId: payload.ProjectId },
          headers
        )
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
    *getMapTreeReport({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getTreeReport, payload, headers)
      if (data.success) {
        const ftaMapData = yield call(getFtaMap, payload, headers)
        yield put({
          type: 'querySuccess',
          payload: {
            treeReportList: data.list,
            list: ftaMapData.list,
          },
        })
        router.push({
          pathname: '/project/FTA/onAnalysis',
          query: payload,
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    perputation(state, action) {
      const xSpace = 170,
        ySpace = 125
      let data = RePositionTree(action.payload.data, xSpace, ySpace)
      return {
        ...state,
        list: { ...state.list, content: JSON.stringify(data) },
      }
    },
  },
})
const RePositionTree = function(jsonTree, xSpace, ySpace) {
  var rootNodes = jsonTree.nodes.filter(node => {
    return node.shape == 'square'
  })
  if (rootNodes.length == 0) {
    return jsonTree
  }

  var rootBaseX = rootNodes[0].x
  var rootBaseY = rootNodes[0].y
  for (var i = 0; i < rootNodes.length; i++) {
    var rootNode = rootNodes[i]
    rootNode.x = rootBaseX
    rootNode.y = rootBaseY
    var uiNodessInSameLayer = []
    uiNodessInSameLayer.push(rootNode)

    ;(function Recurse(parentNodes) {
      var uiNodes = []
      for (var i = 0; i < parentNodes.length; i++) {
        var edges = jsonTree.edges.filter(edge => {
          return edge.source === parentNodes[i].id
        })
        for (var j = 0; j < edges.length; j++) {
          var childNode = jsonTree.nodes.find(node => {
            return node.id == edges[j].target
          })
          if (childNode != undefined) {
            uiNodes.push(childNode)
          }
        }
      }

      if (uiNodes.length > 0) {
        var x = rootBaseX - ((uiNodes.length - 1) * xSpace) / 2
        rootBaseY = rootBaseY + ySpace

        for (var u = 0; u < uiNodes.length; u++) {
          uiNodes[u].x = x
          uiNodes[u].y = rootBaseY
          x = x + xSpace
        }

        Recurse(uiNodes)
      }
    })(uiNodessInSameLayer)

    rootBaseY = rootBaseY + ySpace
  }

  return jsonTree
}
