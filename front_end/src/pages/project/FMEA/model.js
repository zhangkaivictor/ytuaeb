import modelExtend from 'dva-model-extend'
import { getFmeaData, postFmeaData, remotePrecaution } from 'api'
import { pathMatchRegexp, router } from 'utils'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import {
  StructurePane,
  StructureFunction,
  FunctionFailure,
  StructureNode,
  ConvertJsonToStructurePane,
} from './components/structure'

// import { st} from
export default modelExtend(pageModel, {
  namespace: 'FMEA',
  state: {
    nodeData: {
      nodes: [],
      edges: [],
    },
    StructurePane: null,
    structureNodes: [],
    selectedStructure: null,
    createModalVisible: false,
    failActionModalVisiable: false,
    DependModalVisiable: false,
    createModalType: 0,
    createModalTitle: '添加功能',
    selectedFun: null,
    selectedFail: null,
    actionType: -1,
    remotePrecautions: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/project/FMEA', location.pathname)) {
          if (location.query.projectId != undefined) {
            dispatch({
              type: 'getFmea',
              payload: {
                projectId: location.query.projectId,
              },
            })
          } else {
            message.info('目前没有项目，请新建！！！')
            setTimeout(() => {
              router.push({
                pathname: '/post',
              })
            }, 0)
          }
        }
      })
    },
  },
  effects: {
    *postFmea({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(postFmeaData, payload, headers)
      console.log(data)
      if (data.success) {
        // yield put({
        //   type: 'querySuccess',
        //   payload: {
        //     list: data.list,
        //   },
        // })
        message.success('保存成功')
      } else {
        throw data
      }
    },
    *getFmea({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getFmeaData, payload, headers)
      if (data.success) {
        yield put({
          type: 'queryFmeaSuccess',
          payload: {
            list: data.list.content,
          },
        })
      }
    },
    *GetPrecautionOption({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = {
        keywords: JSON.stringify({
          "scope": "failureProperty",
          "keywords": payload
        })
      }
      const response = yield call(remotePrecaution, data, headers)
      if (response.success) {
        yield put({
          type: 'remotePrecautionSuccess',
          payload: {
            list: response.list,
          },
        })
      }
    }
  },
  reducers: {
    //获取结构对象
    queryFmeaSuccess(state, { payload }) {
      if (!payload.list) {
        return {
          ...state,
          nodeData: {
            nodes: [],
            edges: [],
          },
          StructurePane: null,
        }
      }
      let structurePaneObj = ConvertJsonToStructurePane(payload.list)
      let nodeData = {
        nodes: [],
        edges: [],
      }
      structurePaneObj.structureNodes.forEach(structure => {
        nodeData.nodes.push({
          type: 'node',
          size: '70*70',
          shape: structure.shape,
          root:
            structurePaneObj.structureTreeRoot &&
              structure.id == structurePaneObj.structureTreeRoot.id
              ? true
              : false,
          label: structure.name,
          x: structure.x,
          y: structure.y,
          id: structure.paneId,
          structureId: structure.id,
          style: {
            stroke:
              structurePaneObj.structureTreeRoot &&
                structure.id == structurePaneObj.structureTreeRoot.id
                ? 'red'
                : '',
            fill:
              structurePaneObj.structureTreeRoot &&
                structure.id == structurePaneObj.structureTreeRoot.id
                ? 'red'
                : '',
          },
        })
        if (structure.children.length > 0) {
          structure.children.forEach(child => {
            nodeData.edges.push({
              source: structure.paneId,
              // sourceAnchor: 2,
              target: child.paneId,
              // targetAnchor: 0,
              // id: '7989ac70',
              // index: 1,
            })
          })
        }
      })
      return {
        ...state,
        nodeData: nodeData,
        StructurePane: ConvertJsonToStructurePane(payload.list),
      }
    },
    //添加节点
    addNode(state, { payload }) {
      let StructurePaneObj =
        state.StructurePane == null
          ? new StructurePane('fmea')
          : state.StructurePane
      let node = new StructureNode(
        payload.addModel.label,
        payload.addModel.x,
        payload.addModel.y,
        payload.addModel.shape
      )
      let nodesList = StructurePaneObj.structureNodes.concat(
        Object.assign(node, { paneId: payload.addModel.id })
      )
      //画布node
      let paneNode = Object.assign(payload.addModel, { structureId: node.id })
      return {
        ...state,
        StructurePane: Object.assign(
          Object.create(Object.getPrototypeOf(StructurePaneObj)),
          StructurePaneObj,
          { structureNodes: nodesList }
        ),
        nodeData: {
          ...state.nodeData,
          nodes: state.nodeData.nodes.concat(paneNode),
        },
      }
    },
    //添加关系线=》添加子功能
    addEdge(state, { payload }) {
      //禁止指向根节点
      console.log(payload)
      let canAddEdge = true
      if (
        state.StructurePane.structureTreeRoot &&
        state.StructurePane.structureTreeRoot.paneId == payload.addModel.target
      ) {
        alert('根节点')
        canAddEdge = false
      }
      //防止闭环
      let node = state.StructurePane.structureNodes.find(
        structure => structure.paneId == payload.addModel.source
      )
      let allAboveNodes = node
        .allAboveNodes()
        .map(structure => structure.paneId)
      if (allAboveNodes.indexOf(payload.addModel.target) >= 0) {
        alert('闭环')
        canAddEdge = false
      }
      //防止重复
      let edges = state.nodeData.edges
      edges.forEach(edge => {
        if (
          edge.source == payload.addModel.source &&
          edge.target == payload.addModel.target
        ) {
          alert('重复')
          canAddEdge = false
        }
      })

      //添加关系
      let parentNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.source
      )
      let childNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.target
      )
      //未指向子节点
      if (!childNode) {
        canAddEdge = false
      }
      if (!canAddEdge) {
        let nodeData = Object.assign(
          Object.create(Object.getPrototypeOf(state.nodeData)),
          state.nodeData
        )
        return {
          ...state,
          nodeData: nodeData,
        }
      }
      if (parentNode && childNode) {
        parentNode.appendChild(childNode)
        return {
          ...state,
          nodeData: {
            ...state.nodeData,
            edges: state.nodeData.edges.concat(payload.addModel),
          },
        }
      }
    },
    //更新节点位置
    updateNode(state, { payload }) {
      let StructurePaneObj = state.StructurePane
      let nodesList = StructurePaneObj.structureNodes.map(structureNode => {
        payload.forEach(paneNode => {
          if (paneNode.id == structureNode.paneId) {
            structureNode.x = paneNode.x
            structureNode.y = paneNode.y
          }
        })
        return structureNode
      })
      return {
        ...state,
        StructurePane: Object.assign(
          Object.create(Object.getPrototypeOf(StructurePaneObj)),
          StructurePaneObj,
          { structureNodes: nodesList }
        ),
        nodeData: Object.assign({}, state.nodeData, { nodes: payload }),
      }
    },
    //更新节点label
    updateLabel(state, { payload }) {
      let StructurePaneObj = state.StructurePane
      let node = StructurePaneObj.structureNodes.find(
        node => node.id == state.selectedStructure.id
      )
      let nodesList = StructurePaneObj.structureNodes.map(node => {
        if (node.id == state.selectedStructure.id) {
          node.name = payload.value
        }
        return node
      })
      let nodes = state.nodeData.nodes.map(_ =>
        _.id == state.selectedStructure.paneId
          ? { ..._, label: payload.value }
          : _
      )
      return {
        ...state,
        StructurePane: Object.assign(
          Object.create(Object.getPrototypeOf(StructurePaneObj)),
          StructurePaneObj,
          { structureNodes: nodesList }
        ),
        selectedStructure: Object.assign({}, node, { name: payload.value }),
        nodeData: Object.assign({}, state.nodeData, { nodes: nodes }),
      }
    },
    //移除节点
    deleteNode(state, { payload }) {
      //删除点时删除连接线
      let filterEdges = state.nodeData.edges.filter(_ => {
        if (
          _.source !== state.nodeData.nodes[payload].id &&
          _.target !== state.nodeData.nodes[payload].id
        ) {
          return _
        }
      })
      //删除结构树的节点
      let StructurePaneObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.StructurePane)),
        state.StructurePane
      )
      StructurePaneObj.deleteStructureNodeById(
        state.nodeData.nodes[payload].structureId
      )
      //删除结构

      return {
        ...state,
        nodeData: {
          ...state.nodeData,
          nodes: state.nodeData.nodes.filter((_, i) => i !== payload),
          edges: filterEdges,
        },
        StructurePane: StructurePaneObj,
        selectedStructure: null,
        selectedFun: null,
      }
    },
    //移除连接线
    deleteEdge(state, { payload }) {
      return {
        ...state,
        nodeData: {
          ...state.nodeData,
          edges: state.nodeData.edges.filter((_, i) => i !== payload),
        },
      }
    },
    //选择节点
    selectStructure(state, { payload }) {
      let node = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.item.id
      )
      return {
        ...state,
        selectedStructure: node,
        createModalType: 0,
        actionType: 0,
      }
    },
    //添加功能
    addFunction(state, { payload }) {
      if (!state.selectedStructure) {
        alert('请选择结构')
        return state
      }
      let fun = new StructureFunction(payload.data.name)
      let structureNodeObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.selectedStructure)),
        state.selectedStructure
      )
      structureNodeObj.appendFunction(fun)
      return {
        ...state,
        createModalVisible: false,
        selectedStructure: structureNodeObj,
      }
    },
    //选择功能或失效
    selectKey(state, { payload }) {
      let fun = state.selectedStructure.FunctionSet.find(
        fail => fail.id == payload.id
      )
      if (fun) {
        //选择功能
        return {
          ...state,
          actionType: 1,
          selectedFun: fun,
        }
      } else {
        //选择失效
        let funn = null,
          faill = null
        state.selectedStructure.FunctionSet.forEach(fun => {
          fun.FailureSet.forEach(fail => {
            if (fail.id == payload.id) {
              console.log(fail)
              faill = fail
              funn = fun
            }
          })
        })
        return {
          ...state,
          actionType: 2,
          selectedFun: funn,
          selectedFail: faill,
        }
      }
    },
    //添加失效
    addFunctionFailure(state, { payload }) {
      let failure = new FunctionFailure(payload.data.name)
      let currentFun = state.selectedStructure.findFunctionById(
        state.selectedFun.id
      )
      currentFun.appendFailure(failure)
      return {
        ...state,
        createModalVisible: false,
        selectedFun: currentFun,
      }
    },
    //删除功能
    removeFun(state, { payload }) {
      if (!state.selectedStructure || !state.selectedFun) {
        alert('请选择功能')
        return
      }
      state.selectedStructure.removeFunctionById(state.selectedFun.id)
      return {
        ...state,
        selectedFun: null,
        selectedFail: null,
      }
    },
    //添加功能依赖
    addFunctionDependent(state, { payload }) {
      // let dependentFunction = null
      // state.selectedStructure.allAboveNodes().forEach(node => {
      //   node.FunctionSet.forEach(fun => {
      //     if (fun.id == payload.data.id) {
      //       dependentFunction = fun
      //     }
      //   })
      // })
      // if (dependentFunction == null) {
      //   return {
      //     ...state,
      //     createModalVisible: false,
      //   }
      // }
      // state.selectedFun.appendDependentFunction(dependentFunction)
      payload.data.forEach(funId => {
        let dependentFunction = null
        state.selectedStructure.allAboveNodes().forEach(node => {
          node.FunctionSet.forEach(fun => {
            if (fun.id == funId) {
              dependentFunction = fun
            }
          })
        })
        if (dependentFunction == null) {
          return {
            ...state,
            DependModalVisiable: false,
          }
        }
        state.selectedFun.appendDependentFunction(dependentFunction)
      })
      return {
        ...state,
        createModalVisible: false,
      }
    },
    //添加失效依赖
    addFunctionFailureDependent(state, { payload }) {
      let dependentFail = null
      state.selectedStructure.allAboveNodes().forEach(node => {
        node.FunctionSet.forEach(fun => {
          fun.FailureSet.forEach(fail => {
            if (fail.id == payload.data.id) {
              dependentFail = fail
            }
          })
        })
      })
      if (dependentFail == null) {
        return {
          ...state,
          createModalVisible: false,
        }
      }
      state.selectedFail.appendDependentFailure(dependentFail)
      // for (var i = 0, length = state.selectedFail.dependentFailureSet.length; i < length; i++) {
      //   if (state.selectedFail[i].id == dependentFail.id) {
      //     return {
      //       ...state,
      //       createModalVisible: false,
      //     }
      //   }
      // }
      return {
        ...state,
        createModalVisible: false,
        // selectedFun:,
      }
    },
    //移除失效
    removeFail(state, { payload }) {
      // state.selectedFun.removeFailureById(state.selectedFail.id)
      let StructurePaneObj = Object.assign(Object.create(Object.getPrototypeOf(state.StructurePane)), state.StructurePane)
      StructurePaneObj.deleteFailureInFunction(state.selectedStructure.id, state.selectedFun.id, state.selectedFail.id)
      return {
        ...state,
        StructurePane: StructurePaneObj,
        selectedFail: null,
        actionType: 1
        // selectedFail: null,
      }
    },
    //移除功能依赖
    removeFunDepend(state, { payload }) {
      console.log(payload.id.slice(0, -5))
      console.log(payload.id.slice(0, -5), state.actionType)
      let StructurePaneObj = Object.assign(Object.create(Object.getPrototypeOf(state.StructurePane)), state.StructurePane)
      if (state.actionType == 1) {
        StructurePaneObj.deleteDependentFunction(state.selectedStructure.id, state.selectedFun.id, '', payload.id.slice(0, -5))
      } else {
        StructurePaneObj.deleteDependentFailure(state.selectedStructure.id, state.selectedFun.id, state.selectedFail.id, '', '', payload.id.slice(0, -5))
      }
      console.log(StructurePaneObj)
      return {
        ...state,
        StructurePane: StructurePaneObj,
        // selectedFail:null,
        // actionType:1
        // selectedFail: null,
      }

    },
    //添加失效措施
    editFailProps(state, { payload }) {
      let StructurePaneObj = Object.assign(Object.create(Object.getPrototypeOf(state.StructurePane)), state.StructurePane)
      console.log(payload)
      // payload.forEach(prop=>{
      StructurePaneObj.AddFailureProperties(state.selectedStructure.id,
        state.selectedFun.id,
        state.selectedFail.id,
        payload)
      // })
      console.log(StructurePaneObj)
      return {
        ...state,
        failActionModalVisiable: false,
        StructurePane: StructurePaneObj
      }
    },
    //点击modal类型
    triggerType(state, { payload }) {
      let text =
        payload.type == 0
          ? '添加功能'
          : payload.type == 1
            ? '添加失效'
            : payload.type == 2
              ? '添加失效依赖'
              : '添加功能依赖'
      if (payload.type == 0) {
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          createModalVisible: true,
        }
      } else if (payload.type == 1) {
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          createModalVisible: true,
        }
      } else if (payload.type == 2) {
        // return {
        //   ...state,
        //   createModalType: payload.type,
        //   createModalTitle: text,
        //   createModalVisible: true,
        // }
        return {
          ...state,
          DependModalVisiable: true,
          createModalType: payload.type,
          createModalTitle: text,
        }
      } else if (payload.type == 3) {
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          // createModalVisible: true,
          DependModalVisiable: true,
        }
      } else {
        return state
      }
    },
    //显示对话框
    triggerModal(state, action) {
      return {
        ...state,
        createModalVisible: action.payload.visible,
      }
    },
    //设置根节点
    setRootNode(state, action) {
      let StructurePaneObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.StructurePane)),
        state.StructurePane
      )
      //SetStructureTreeRootById
      StructurePaneObj.SetStructureTreeRootById(state.selectedStructure.id)
      let edges = state.nodeData.edges.filter(
        _ => _.target !== state.selectedStructure.paneId
      )
      let nodes = state.nodeData.nodes.map(_ =>
        _.id == state.selectedStructure.paneId
          ? {
            ..._,
            root: true,
            style: {
              stroke: 'red',
              fill: 'red',
            },
          }
          : { ..._, root: false, style: '' }
      )
      return {
        ...state,
        StructurePane: StructurePaneObj,
        // selectedStructure: node,
        createModalType: 0,
        actionType: 0,
        nodeData: { edges: edges, nodes: nodes },
      }
    },
    cancelRootNode(state, action) {
      let StructurePaneObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.StructurePane)),
        state.StructurePane
      )
      StructurePaneObj.structureTreeRoot = null
      let nodes = state.nodeData.nodes.map(_ =>
        _.id == state.selectedStructure.paneId
          ? { ..._, style: '', root: false }
          : _
      )
      return {
        ...state,
        StructurePane: StructurePaneObj,
        nodeData: { ...state.nodeData, nodes: nodes },
      }
    },
    //排列
    perputation(state, action) {
      console.log(state, action)
      let structurePaneObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.StructurePane)),
        state.StructurePane
      )
      if (structurePaneObj.CheckIfRePositionAble() < 0) {
        message.error('未找到根节点！')
        return
      }
      structurePaneObj.RePositionTree(100, 80)
      let nodeData = {
        nodes: [],
        edges: [],
      }
      structurePaneObj.structureNodes.forEach(structure => {
        nodeData.nodes.push({
          type: 'node',
          size: '70*70',
          shape: structure.shape,
          root:
            structure.id == structurePaneObj.structureTreeRoot.id
              ? true
              : false,
          label: structure.name,
          x: structure.x,
          y: structure.y,
          id: structure.paneId,
          structureId: structure.id,
          style: {
            stroke:
              structure.id == structurePaneObj.structureTreeRoot.id
                ? '#e83632'
                : '',
            fill:
              structure.id == structurePaneObj.structureTreeRoot.id
                ? '#e83632'
                : '',
          },
        })
        if (structure.children.length > 0) {
          structure.children.forEach(child => {
            nodeData.edges.push({
              source: structure.paneId,
              // sourceAnchor: 2,
              target: child.paneId,
              // targetAnchor: 0,
              // id: '7989ac70',
              // index: 1,
            })
          })
        }
      })
      return {
        ...state,
        StructurePane: structurePaneObj,
        nodeData: nodeData,
      }
    },
    showFailAction(state, action) {
      return {
        ...state,
        failActionModalVisiable: action.payload.show
      }
    },
    showFailDepend(state, action) {
      return {
        ...state,
        DependModalVisiable: action.payload.show
      }
    },
    failAttrSet(state, action) {
      let StructurePaneObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.StructurePane)),
        state.StructurePane
      )
      StructurePaneObj.UpdateFunctionFailureSValue(
        state.selectedStructure.id,
        state.selectedFun.id,
        state.selectedFail.id,
        action.payload
      )
      return {
        ...state,
        StructurePane: StructurePaneObj,
      }
    },
    remotePrecautionSuccess(state, action) {
      console.log(action)
      return {
        ...state,
        remotePrecautions: action.payload.list
      }
    }
  },
})
