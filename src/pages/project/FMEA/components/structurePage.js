import React from 'react'
import { Row, Col } from 'antd'
import GGEditor, { Flow, withPropsAPI } from 'gg-editor'
import { FlowContextMenu } from '../components/EditorContextMenu'
import { FlowToolbar } from '../components/EditorToolbar'
import { FlowItemPanel } from '../components/EditorItemPanel'
import styles from './structurePage.less'
import { Button } from 'antd'
import { FMEAObjectToJSONString } from './structure'
import router from 'umi/router'
import Redirect from 'umi/redirect'
class StructurePage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    console.log(this.props)
    // console.log(this.props.propsAPI.read());
  }
  handleClick() {
    console.log('save')
    console.log(FMEAObjectToJSONString(this.props.FMEA.StructurePane))
    // router.push('/ccc');
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
          <Col span={20}>
            <FlowToolbar />
          </Col>
          <Col span={4}>
            <Button
              onClick={e => {
                this.handleClick(e)
              }}
            >
              保存
            </Button>
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
              style={{ height: 450 }}
              onNodeClick={e => {
                this.props.nodeClick(e)
              }}
              data={this.props.FMEA.nodeData}
            />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
    )
  }
}

export default withPropsAPI(StructurePage)
