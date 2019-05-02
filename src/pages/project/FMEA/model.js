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
      return {
        ...state,
        StructurePane: { ...state.StructurePane, structureNodes: nodesList },
        selectedStructure: node,
        createModalType: 0,
        actionType: 0,
      }
    },
    //添加关系线=》添加子功能
    addEdge(state, { payload }) {
      console.log(payload)
      let parentNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.source
      )
      let childNode = state.StructurePane.structureNodes.find(
        node => node.paneId == payload.addModel.target
      )
      if (parentNode && childNode) {
        parentNode.appendChild(childNode)
        // return {
        //   ...state,
        //   // StructurePane: { ...state.StructurePane }
        // }
      }
    },
    //移除节点
    deleteNode(state, action) {},
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
    //选择功能
    // selectFun(state, { payload }) {
    //   return {
    //     ...state,
    //     actionType: 1,
    //     selectedFun: state.selectedStructure.FunctionSet.find(fun => fun.id == payload.id)
    //   }
    // },
    // //选择失效
    // selectFail(state, { payload }) {
    //   console.log(state.selectedFun, payload)
    //   return {
    //     ...state,
    //     actionType: 2,
    //     selectedFail: state.selectedFun.FailureSet.find(fail => fail.id == payload.id)
    //   }
    // },
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
      // for (var i = 0, length = state.selectedFun.dependentFunctionSet.length; i < length; i++) {
      //   if (state.selectedFun.dependentFunctionSet[i].id == dependentFunction.id) {
      //     return {
      //       ...state,
      //       createModalVisible: false,
      //     }
      //   }
      // }
      // let fun = Object.assign(Object.create(Object.getPrototypeOf(state.selectedFun)), state.selectedFun, { dependentFunctionSet: state.selectedFun.dependentFunctionSet.concat(dependentFunction) })
      // console.log(fun)
      // return {
      //   ...state,
      //   createModalVisible: false,
      //   selectedFun: fun,
      //   selectedStructure: Object.assign(Object.create(Object.getPrototypeOf(state.selectedStructure)), state.selectedStructure, {
      //     FunctionSet: state.selectedStructure.FunctionSet.map(func => {
      //       if (func.id == state.selectedFun.id) {
      //         func = fun
      //       }
      //       return func
      //     })
      //   })
      //   ,
      //   StructurePane: {
      //     ...state.StructurePane,
      //     structureNodes: state.StructurePane.structureNodes.map(node => {
      //       if (node.id == state.selectedStructure.id) {
      //         node.FunctionSet.map(func => {
      //           if (func.id == state.selectedFun.id) {
      //             func = fun
      //             console.log(func)
      //           }
      //           return func
      //         })
      //       }
      //       return node
      //     })
      //   }
      // }
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
  },
})
function resetTree(obj) {
  delete obj['parent']
  delete obj['children']
  // if(obj.children.length>0){
  //   obj.children.forEach(element => {
  //    resetTree(element)
  //   });}
  // }else{
  return obj
  // }
}
