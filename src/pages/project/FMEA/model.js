import modelExtend from 'dva-model-extend'
import { createPostFtaMap, getFtaMap, getAnalyzeTree } from 'api'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import {
  StructurePane,
  StructureFunction,
  FunctionFailure,
  StructureNode,
} from './components/structure'
import { cloneDeep, isString, flow, curry } from 'lodash'

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
    createModalType: 0,
    createModalTitle: '添加功能',
    selectedFun: null,
    selectedFail: null,
    actionType: -1,
  },
  subscriptions: {},
  effects: {},
  reducers: {
    print(state, { payload: id }) {
      console.log(state.structure, id)
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
        payload.addModel.y
      )
      let nodesList = StructurePaneObj.structureNodes.concat(
        Object.assign(node, { paneId: payload.addModel.id })
      )
      //画布node
      let paneNode = Object.assign(payload.addModel, { structureId: node.id })
      console.log(StructurePaneObj)
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
      console.log(payload)
      //禁止指向根节点
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
      console.log(allAboveNodes)
      if (allAboveNodes.indexOf(payload.addModel.target) >= 0) {
        alert('闭环')
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
      //添加关系
      let parentNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.source
      )
      let childNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.target
      )
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
    //移除节点
    deleteNode(state, { payload }) {
      console.log(payload)
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
      console.log(StructurePaneObj)
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
      console.log(payload)
      console.log(state.nodeData.edges.filter((_, i) => i !== payload))
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
        return
      }
      let fun = new StructureFunction(payload.data.name)
      let structureNodeObj = Object.assign(
        Object.create(Object.getPrototypeOf(state.selectedStructure)),
        state.selectedStructure
      )
      console.log(structureNodeObj)
      structureNodeObj.appendFunction(fun)
      return {
        ...state,
        createModalVisible: false,
        selectedStructure: structureNodeObj,
      }
    },
    //选择功能或失效
    selectKey(state, { payload }) {
      console.log(state.selectedFun, payload)
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
      console.log(state.selectedStructure, state.selectedFun)
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
      let dependentFunction = null
      state.selectedStructure.allAboveNodes().forEach(node => {
        node.FunctionSet.forEach(fun => {
          if (fun.id == payload.data.id) {
            dependentFunction = fun
          }
        })
      })
      if (dependentFunction == null) {
        return {
          ...state,
          createModalVisible: false,
        }
      }
      state.selectedFun.appendDependentFunction(dependentFunction)
      return {
        ...state,
        createModalVisible: false,
      }
    },
    //添加失效依赖
    addFunctionFailureDependent(state, { payload }) {
      console.log(payload)
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
      console.log(dependentFail)
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
      state.selectedFun.removeFailureById(state.selectedFail.id)
      return {
        ...state,
        selectedFail: null,
      }
    },
    //点击modal类型
    triggerType(state, { payload }) {
      console.log(payload)
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
        console.log(state.selectedStructure, state.selectedFun)
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          createModalVisible: true,
        }
      } else if (payload.type == 2) {
        console.log(state.selectedFail)
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          createModalVisible: true,
        }
      } else if (payload.type == 3) {
        return {
          ...state,
          createModalType: payload.type,
          createModalTitle: text,
          createModalVisible: true,
        }
      } else {
        console.log(state.selectedStructure)

        // console.log(state.selectedStructure.findFunctionById(payload.id).name)
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
      console.log(StructurePaneObj)
      StructurePaneObj.SetStructureTreeRootById(state.selectedStructure.id)
      let edges = state.nodeData.edges.filter(
        _ => _.target !== state.selectedStructure.paneId
      )
      console.log(edges)
      return {
        ...state,
        StructurePane: StructurePaneObj,
        // selectedStructure: node,
        createModalType: 0,
        actionType: 0,
        nodeData: { ...state.nodeData, edges: edges },
      }
    },
  },
})
