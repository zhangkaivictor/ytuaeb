import React from 'react'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'
import GGEditor, { Flow } from 'gg-editor'
import EditorMinimap from './components/EditorMinimap/index'
import { FlowContextMenu } from './components/EditorContextMenu/index'
import { FlowToolbar } from './components/EditorToolbar/index'
import EditorItemPanel from './components/EditorItemPanel/index'
import { FlowDetailPanel } from './components/EditorDetailPanel/index'
import FlowMap from './components/EditorMap/index'
import Save from './components/Save/index'
import Analysis from './components/analysis/index'
import styles from './index.less'

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
@connect(({ FTA, loading }) => ({ FTA, loading }))
class FlowPage extends React.Component {
  render() {
    const { dispatch, FTA, location } = this.props
    const { query } = location
    const Id = guid()

    const mapProps = {
      onOk(data) {
        if (query.projectId != undefined) {
          data['ProjectId'] = query.projectId
          data['Id'] = Id
          dispatch({
            type: `FTA/createQuery`,
            payload: data,
          }).then(() => {
            alert('提交成功！！！')
          })
        } else {
          alert('无法保存，请移步至项目管理新建项目！！！')
        }
      },
    }
    const flowMapProps = {
      data: FTA.list.content,
    }
    const analysisProps = {
      onOk(data) {
        if (query.projectId != undefined) {
          data['ProjectId'] = query.projectId
          data['Id'] = Id
          dispatch({
            type: `FTA/getMapAnalyzeTree`,
            payload: data,
          }).then(() => {
            alert('分析提交成功！！！')
          })
        } else {
          alert('无法分析，请移步至项目管理新建项目！！！')
        }
      },
    }

    return (
      <GGEditor className={styles.editor}>
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
            <div className={styles.save}>
              <Save {...mapProps} />
              <Analysis {...analysisProps} />
            </div>
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <EditorItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            <FlowMap {...flowMapProps} />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <FlowDetailPanel />
            <EditorMinimap />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
    )
  }
}

export default FlowPage
