import React from 'react'
import { Row, Col, Button, Modal, Input } from 'antd'
import styles from './index.less'
import GGEditor, { Flow, Mind } from 'gg-editor'
import StructurePage from './components/structurePage'
import TreePage from './components/treePage'
import AddModal from './components/Modal'
import { connect } from 'dva'

@connect(({ FMEA }) => ({ FMEA }))
class FmeaPage extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
  }
  // componentDidMount() {

  // }
  panelAction(e) {
    console.log(e)
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
      console.log(e.itemIds)
      // console.log(this.props.FMEA.nodeData.nodes.findIndex(node=>node.id==e.itemIds[0]))
      // console.log(this.props.FMEA.nodeData.edges.findIndex(edge=>edge.id==e.itemIds[0]))
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
    console.log(e)
    this.props.dispatch({ type: 'FMEA/selectStructure', payload: e })
  }
  render() {
    const { dispatch, FMEA, location } = this.props
    const {
      createModalType,
      createModalTitle,
      createModalVisible,
      createModalItem,
    } = FMEA
    console.log(createModalVisible, this.props)
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
        console.log(data)
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
    // const treeProps = {
    //   ...this.props,
    //   treeClick(e, treeId, treeNode) {
    //     console.log(treeNode)
    //     if (treeNode.type == 'fun') {
    //       dispatch({ type: 'FMEA/triggerType', payload: { id: treeNode.id, type: 1 } })
    //     } else {
    //       dispatch({ type: 'FMEA/triggerType', payload: { id: treeNode.id, type: 2 } })
    //     }
    //   },
    //   structureClick() {
    //     dispatch({ type: 'FMEA/triggerType', payload: { type: 0 } })
    //   }
    // }
    const getChildLebal = arr => {}

    let viewData = null
    const getViewData = () => {
      console.log(this.props.FMEA)
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
    console.log(viewData)
    return (
      <div className={styles.structurePage}>
        <Row type="flex">
          <Col span={18} className={styles.structure}>
            <StructurePage
              panelAction={e => {
                this.panelAction(e)
              }}
              nodeClick={e => {
                this.nodeClick(e)
              }}
              {...this.props}
            />
          </Col>
          <Col span={6} className={styles.set}>
            <TreePage {...this.props} />
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.view}>
            {viewData != null && (
              <GGEditor>
                <Mind style={{ height: 300 }} data={viewData} />
              </GGEditor>
            )}
          </Col>
        </Row>
        {createModalVisible && <AddModal {...modalProps} />}
      </div>
    )
  }
}

export default FmeaPage
// export default connect(({ FMEA }) => ({
//   FMEA,
// }))(FmeaPage);
