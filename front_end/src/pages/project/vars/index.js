import React from 'react'
import { Row, Col, Button, Modal, Input, Spin } from 'antd'
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
    const getTreeEle = () => {
      if (this.props.VARS.projectContent != null) {
        return (
          <Col span={5} className={styles.tree}>
            <div>{this.props.VARS.projectContent.name}</div>
            <ContentTree {...this.props} />
          </Col>
        )
      } else {
        return (
          <Col span={5} className={styles.tree}>
            <div>查询项目失败，请刷新后重试</div>
          </Col>
        )
      }
    }
    return (
      <div className={styles.workPro}>
        <Row type="flex">
          {getTreeEle()}
          <Col span={19} className={styles.page}>
            <div className={styles.pageBorder}>
              <ProjectPage {...this.props} />
            </div>
          </Col>
        </Row>
        {this.props.VARS.spin && (
          <div className={styles.innerSpin}>
            <Spin tip={this.props.VARS.spinText} />
          </div>
        )}
        {/* {createModalVisible && <AddModal {...modalProps} />} */}
      </div>
    )
  }
}
export default connect(({ VARS }) => ({
  VARS,
}))(WorkProPage)
