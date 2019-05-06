import React from 'react'
import { Row, Col } from 'antd'
import GGEditor, { Flow, withPropsAPI } from 'gg-editor'
import { FlowContextMenu } from '../components/EditorContextMenu'
import { FlowToolbar } from '../components/EditorToolbar'
import { FlowItemPanel } from '../components/EditorItemPanel'
import styles from './structurePage.less'

class StructurePage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    console.log(this.props)
    // console.log(this.props.propsAPI.read());
  }
  render() {
    return (
      <GGEditor
        className={styles.editor}
        onAfterCommandExecute={({ command }) => {
          this.props.panelAction(command)
        }}
      >
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <FlowItemPanel style={{ width: 500, height: 368 }} />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <Flow
              style={{ width: 500, height: 368 }}
              className={styles.flow}
              onNodeClick={e => {
                this.props.nodeClick(e)
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
