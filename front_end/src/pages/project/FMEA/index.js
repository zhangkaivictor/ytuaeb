import React from 'react'
import { Row, Col, Button, Modal, Input } from 'antd'
import styles from './index.less'
import GGEditor, { Flow, Mind } from 'gg-editor'
import StructurePage from './components/structurePage'
import TreePage from './components/treePage'
import ViewPage from './components/viewPage'
import AddModal from './components/Modal'
import FailActionModal from './components/failAction/failActionModal'
import { connect } from 'dva'

@connect(({ FMEA }) => ({ FMEA }))
class FmeaPage extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
  }
  // componentDidMount() {

  // }
  saveFmea(data) {
    console.log(data)
    const { dispatch, location } = this.props
    const { query } = location
    if (query.projectId != undefined) {
      data.projectId = query.projectId
      dispatch({
        type: `FMEA/postFmea`,
        payload: data,
      })
    } else {
      alert('无法保存，请移步至项目管理新建项目！！！')
    }
  }
  panelAction(e) {
    if (e.name == 'add') {
      switch (e.type) {
        case 'node':
          this.props.dispatch({ type: 'FMEA/addNode', payload: e })
          break
        case 'edge':
          this.props.dispatch({ type: 'FMEA/addEdge', payload: e })
          break
        default:
          return
      }
    } else if ((e.name = 'delete')) {
      if (
        e.itemIds &&
        this.props.FMEA.nodeData.nodes.findIndex(
          node => node.id == e.itemIds[0]
        ) >= 0
      ) {
        this.props.dispatch({
          type: 'FMEA/deleteNode',
          payload: this.props.FMEA.nodeData.nodes.findIndex(
            node => node.id == e.itemIds[0]
          ),
        })
      } else if (e.itemIds) {
        this.props.dispatch({
          type: 'FMEA/deleteEdge',
          payload: this.props.FMEA.nodeData.edges.findIndex(
            edge => edge.id == e.itemIds[0]
          ),
        })
      }
    }
  }
  //选择结构
  nodeClick(e) {
    this.props.dispatch({ type: 'FMEA/selectStructure', payload: e })
  }
  render() {
    const { dispatch, FMEA, location } = this.props
    const {
      createModalType,
      createModalTitle,
      createModalVisible,
      failActionModalVisiable,
      createModalItem,
    } = FMEA
    const modalProps = {
      type: createModalType,
      visible: createModalVisible,
      title: createModalTitle,
      FMEA: FMEA,
      onCancel() {
        dispatch({
          type: 'FMEA/triggerModal',
          payload: {
            visiable: false,
          },
        })
      },
      onOk(data) {
        if (createModalType == 0) {
          dispatch({
            type: 'FMEA/addFunction',
            payload: {
              data,
            },
          })
        } else if (createModalType == 1) {
          dispatch({
            type: 'FMEA/addFunctionFailure',
            payload: {
              data,
            },
          })
        } else if (createModalType == 2) {
          dispatch({
            type: 'FMEA/addFunctionFailureDependent',
            payload: {
              data,
            },
          })
        } else {
          dispatch({
            type: 'FMEA/addFunctionDependent',
            payload: {
              data,
            },
          })
        }
      },
    }
    let viewData = null
    const getViewData = () => {
      if (this.props.FMEA.StructurePane === null) {
        return
      }
      if (this.props.FMEA.selectedStructure === null) {
        return
      }
      if (
        this.props.FMEA.actionType == 1 &&
        this.props.FMEA.selectedFun !== null
      ) {
        let treeData = this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
          this.props.FMEA.selectedStructure.id,
          this.props.FMEA.selectedFun.id
        )
        viewData = treeData
          ? {
              roots: [
                {
                  label:
                    this.props.FMEA.selectedStructure.name +
                    '--' +
                    this.props.FMEA.selectedFun.name,
                  children: this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
                    this.props.FMEA.selectedStructure.id,
                    this.props.FMEA.selectedFun.id
                  ).leftChilds.concat(
                    this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
                      this.props.FMEA.selectedStructure.id,
                      this.props.FMEA.selectedFun.id
                    ).rightChilds
                  ),
                },
              ],
            }
          : null
      } else if (
        this.props.FMEA.actionType == 2 &&
        this.props.FMEA.selectedFail !== null
      ) {
        let treeData = this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
          this.props.FMEA.selectedStructure.id,
          this.props.FMEA.selectedFun.id,
          this.props.FMEA.selectedFail.id
        )
        viewData = treeData
          ? {
              roots: [
                {
                  label:
                    this.props.FMEA.selectedStructure.name +
                    '--' +
                    this.props.FMEA.selectedFun.name +
                    '--' +
                    this.props.FMEA.selectedFail.name,
                  children: this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
                    this.props.FMEA.selectedStructure.id,
                    this.props.FMEA.selectedFun.id,
                    this.props.FMEA.selectedFail.id
                  ).leftChilds.concat(
                    this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
                      this.props.FMEA.selectedStructure.id,
                      this.props.FMEA.selectedFun.id,
                      this.props.FMEA.selectedFail.id
                    ).rightChilds
                  ),
                },
              ],
            }
          : null
      }
    }
    getViewData()
    return (
      <div className={styles.structurePage} id="ggFMEA">
        <Row type="flex" className={styles.editPanel}>
          <Col span={19} className={styles.structure}>
            <StructurePage
              panelAction={e => {
                this.panelAction(e)
              }}
              nodeClick={e => {
                this.nodeClick(e)
              }}
              save={e => this.saveFmea(e)}
              {...this.props}
            />
          </Col>
          <Col span={5} className={styles.set}>
            <TreePage {...this.props} />
          </Col>
        </Row>
        <Row className={styles.viewPanel}>
          {this.props.FMEA.StructurePane && <ViewPage {...this.props} />}
        </Row>
        {createModalVisible && <AddModal {...modalProps} />}
        {/* {failActionModalVisiable&&<FailAction {...failActionProps}/>} */}
        <FailActionModal {...this.props}/>
      </div>
    )
  }
}

export default FmeaPage
// export default connect(({ FMEA }) => ({
//   FMEA,
// }))(FmeaPage);
