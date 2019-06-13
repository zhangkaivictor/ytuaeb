import React from 'react'
import { Row, Col, Button, Modal, Input } from 'antd'
import styles from './projectPage.less'
import ProjectFile from './projectFile'
import TemplateFile from './templateFile'
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    return (
      <div>
        <Row className={styles.project}>
          <Col span={24}>
            <div className={styles.title}>模板文件列表</div>
            {this.props.VARS.activeNode != null && (
              <ProjectFile {...this.props.VARS.activeNode} />
            )}
          </Col>
        </Row>
        <Row className={styles.template}>
          <Col span={24}>
            <div className={styles.title}>项目文件列表</div>
            {this.props.VARS.activeNode != null && (
              <ProjectFile {...this.props.VARS.activeNode} />
            )}
          </Col>
        </Row>
      </div>
    )
  }
}
export default ProjectPage
