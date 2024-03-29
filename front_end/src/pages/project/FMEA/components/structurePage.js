import React from 'react'
import { Row, Col, message } from 'antd'
import GGEditor, { Flow, withPropsAPI, RegisterBehaviour } from 'gg-editor'
import { FlowContextMenu } from '../components/EditorContextMenu'
import { FlowToolbar } from '../components/EditorToolbar'
import { FlowItemPanel } from '../components/EditorItemPanel'
import styles from './structurePage.less'
import { Button } from 'antd'
import { FMEAObjectToJSONString } from './structure'
import Full from './full/index'

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
class StructurePage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    const { getSelected } = propsAPI
  }
  handleClick() {
    let data = {}
    data.id = guid()
    if (FMEAObjectToJSONString(this.props.FMEA.StructurePane) != 'null') {
      data.content = FMEAObjectToJSONString(this.props.FMEA.StructurePane)
      this.props.save(data)
    } else {
      message.info('没有可保存的信息')
    }
  }
  permutation(e) {
    const { dispatch, FMEA } = this.props
    if (!FMEA.StructurePane) {
      message.info('没有排列的信息')
      return
    }
    if (FMEA.StructurePane.CheckIfRePositionAble != 0) {
      dispatch({ type: 'FMEA/perputation' })
    } else {
    }
  }
  nodeDrag(e) {
    if (e.action === 'update') {
      //更新nodeData
      let node = this.props.FMEA.nodeData.nodes.map(node => {
        if (node.id == e.originModel.id) {
          return Object.assign(node, e.updateModel)
        } else {
          return node
        }
      })
      const { dispatch } = this.props
      dispatch({ type: 'FMEA/updateNode', payload: node })
      //更新structureNode
      //findStructureNodeById
    }
  }
  onSelected(e) {
    // return false
    const item = e.item
    // if (item.hasState('active')) {
    //   graph.setItemState(item, 'active', false);
    //   return;
    // }
  }
  dbClick(e) {
    console.log(e)
  }
  render() {
    let data = {
      // nodes: [{
      //   type: 'node',
      //   size: '70*70',
      //   shape: 'flow-circle',
      //   color: '#FA8C16',
      //   label: '起止节点',
      //   x: 55,
      //   y: 55,
      //   id: 'ea1184e8',
      //   index: 0,
      // }, {
      //   type: 'node',
      //   size: '70*70',
      //   shape: 'flow-circle',
      //   color: '#FA8C16',
      //   label: '结束节点',
      //   x: 55,
      //   y: 255,
      //   id: '481fbb1a',
      //   index: 2,
      // }],
      // edges: [{
      //   source: 'ea1184e8',
      //   sourceAnchor: 2,
      //   target: '481fbb1a',
      //   targetAnchor: 0,
      //   id: '7989ac70',
      //   index: 1,
      // }],
    }
    return (
      <GGEditor
        className={styles.editor}
        onAfterCommandExecute={({ command }) => {
          this.props.panelAction(command)
        }}
      >
        <Row type="flex" className={styles.editorHd}>
          <Col span={16}>
            <FlowToolbar />
          </Col>
          <Col span={8}>
            <Button
              onClick={e => {
                this.handleClick(e)
              }}
            >
              保存
            </Button>
            <Button
              onClick={e => {
                this.permutation(e)
              }}
              style={{ marginLeft: '10px' }}
            >
              排列
            </Button>
            <Full />
          </Col>
          {/* <Redirect to={'/video'} /> */}
          {/* <Col span={4}><Button onClick=this.handleClick(e)>保存</Button></Col> */}
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={3} className={styles.editorSidebar}>
            <FlowItemPanel />
          </Col>
          <Col span={21} className={styles.editorContent}>
            <Flow
              className={styles.flow}
              style={{ height: '100%', minHeight: '500px' }}
              onNodeClick={e => {
                this.props.nodeClick(e)
              }}
              onAfterChange={e => this.nodeDrag(e)}
              data={this.props.FMEA.nodeData}
              onAfterItemSelected={e => this.onSelected(e)}
            />
            <RegisterBehaviour
              name="onDoubleClick"
              behaviour={e => {
                this.dbClick(e)
              }}
            />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
    )
  }
}

export default withPropsAPI(StructurePage)
