import React from 'react'
import { Row, Col, Button, Modal, Input } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import ContentTree from './components/contentTree'
import ProjectPage from './components/projectPage'

class WorkProPage extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // const { dispatch, FMEA, location } = this.props
    return (
      <div className={styles.workPro}>
        <Row type="flex">
          <Col span={5} className={styles.tree}>
            <div>工程项目目录树</div>
            <ContentTree {...this.props} />
          </Col>
          <Col span={19} className={styles.page}>
            <div className={styles.pageBorder}>
              <ProjectPage {...this.props} />
            </div>
          </Col>
        </Row>
        {/* {createModalVisible && <AddModal {...modalProps} />} */}
      </div>
    )
  }
}
export default connect(({ VARS }) => ({
  VARS,
}))(WorkProPage)
