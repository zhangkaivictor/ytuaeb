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
      console.log(JSON.parse(data.list.content))
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
      console.log(action)
      if (CheckIfRePositionAble(action.payload.data) < 0) {
        message.error('未找到根节点！')
        return
      }
      let data = RePositionTree(action.payload.data, xSpace, ySpace)
      return {
        ...state,
        list: { ...state.list, content: JSON.stringify(data) },
      }
    },
  },
})
function CheckIfRePositionAble(jsonTree) {
  console.log(jsonTree.nodes)
  var rootNodes = jsonTree.nodes.filter(node => {
    return node.shape == 'square'
  })
  if (rootNodes.length == 0) {
    return -1 // no root node is found
  }

  return 0 // it is ok to continue the reposition
}

function RePositionTree(jsonTree, xSpace, ySpace) {
  var rootNodes = jsonTree.nodes.filter(node => {
    return node.shape == 'square'
  })
  if (rootNodes.length == 0) {
    return jsonTree
  }

  for (var i = 0; i < rootNodes.length; i++) {
    var rootBaseX = rootNodes[i].x
    var rootBaseY = rootNodes[i].y

    var rootTreeNode = {}
    rootTreeNode.node = rootNodes[i]
    rootTreeNode.parent = null
    rootTreeNode.children = []
    rootTreeNode.layer = 0

    var endNodes = []
    var maxLayer = 0
    var existNodes = []
    existNodes.push(rootNodes[i].id)
    ;(function Recurse(rootNode) {
      var edges = jsonTree.edges.filter(edge => {
        return edge.source === rootNode.node.id
      })

      var childNodes = jsonTree.nodes.filter(node => {
        return (
          edges.find(edge => {
            return edge.target == node.id
          }) != undefined
        )
      })
      childNodes = childNodes.sort((left, right) => {
        return left.x - right.x
      })
      for (var j = 0; j < childNodes.length; j++) {
        var childNode = childNodes[j]
        if (
          existNodes.find(item => {
            return item === childNode.id
          }) == undefined
        ) {
          existNodes.push(childNode.id)

          var treeNode = {}
          treeNode.node = childNode
          treeNode.parent = rootNode
          treeNode.children = []
          treeNode.layer = rootNode.layer + 1
          if (maxLayer < treeNode.layer) {
            maxLayer = treeNode.layer
          }
          treeNode.node.y = rootNode.node.y + ySpace

          rootNode.children.push(treeNode)

          Recurse(treeNode)
        }
      }

      if (rootNode.children.length == 0) {
        endNodes.push(rootNode)
      }
    })(rootTreeNode)

    var x = rootTreeNode.node.x - ((endNodes.length - 1) * xSpace) / 2
    for (var u = 0; u < endNodes.length; u++) {
      endNodes[u].node.x = x
      x = x + ySpace
    }

    var sameLayerNode = []
    for (var k = maxLayer; k > 0; k--) {
      var layerNodes = endNodes.filter(item => {
        return item.layer === k
      })
      layerNodes = layerNodes.concat(sameLayerNode)
      sameLayerNode = []

      var parent = null
      layerNodes.forEach(item => {
        if (item.parent != null && parent != item.parent) {
          parent = item.parent
          parent.node.x =
            (parent.children[0].node.x +
              parent.children[parent.children.length - 1].node.x) /
            2
          sameLayerNode.push(parent)
        }
      })
    }

    var movX = rootBaseX - rootNodes[i].x
    var movY = rootBaseY - rootNodes[i].y
    rootNodes[i].x = rootNodes[i].x + movX
    rootNodes[i].y = rootNodes[i].y + movY
    ;(function MoveBaseRootXY(rootNode) {
      for (var n = 0; n < rootNode.children.length; n++) {
        var childNode = rootNode.children[n].node
        childNode.x = childNode.x + movX
        childNode.y = childNode.y + movY

        MoveBaseRootXY(rootNode.children[n])
      }
    })(rootTreeNode)
  }

  return jsonTree
}
