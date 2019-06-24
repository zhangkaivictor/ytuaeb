import React from 'react'
import { Row, Col, Button, Alert, Upload, Modal, Icon, Select } from 'antd'
import styles from './projectPage.less'
import ProjectFile from './projectFile'
import TemplateFile from './templateFile'
import UploadCon from './uploadCon'
const { Option } = Select
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  handleChange(value) {
    const { dispatch } = this.props
    dispatch({ type: 'VARS/addProject', payload: { projects: value } })
  }
  addProectLink(e) {
    const { dispatch } = this.props
    dispatch({ type: 'VARS/addProjectLink' })
  }
  render() {
    let isAdmin = sessionStorage.getItem('isAdmin')
    if (this.props.VARS.activeNode == null) {
      return (
        <div>
          <Row className={styles.project}>
            <Col span={24}>
              <div className={styles.title}>选择文件夹目录</div>
            </Col>
          </Row>
        </div>
      )
    } else if (this.props.VARS.activeNode.type == 'fmea') {
      let projectList = JSON.parse(sessionStorage.getItem('projectList'))
      let fmeaProject = projectList.filter(pro => pro.type == 'FMEAProject')
      const children = []
      for (let i = 0; i < fmeaProject.length; i++) {
        if (
          this.props.VARS.activeNode.files.find(
            file => file.id == fmeaProject[i].id
          )
        ) {
        } else {
          children.push(
            <Option key={fmeaProject[i].id}>{fmeaProject[i].name}</Option>
          )
        }
      }
      const FMEAProps = {
        ...this.props.VARS.activeNode,
        unBind: a => {
          this.props.dispatch({ type: 'VARS/unBindProject', payload: a })
        },
      }
      return (
        <div>
          <Row className={styles.project}>
            <Col span={12} className={styles.title}>
              FMEA文件列表
            </Col>
            <Col span={5} offset={3}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                value={this.props.VARS.selectForAdd}
                onChange={e => this.handleChange(e)}
              >
                {children}
              </Select>
            </Col>
            <Col span={3} className={styles.addBtn}>
              <Button
                disabled={this.props.VARS.selectForAdd.length == 0}
                onClick={e => this.addProectLink(e)}
              >
                添加FMEA
              </Button>
            </Col>
            <Col span={24} className={styles.table}>
              <TemplateFile {...FMEAProps} />
            </Col>
          </Row>
        </div>
      )
    } else if (this.props.VARS.activeNode.type == 'fta') {
      let projectList = JSON.parse(sessionStorage.getItem('projectList'))
      let ftaProject = projectList.filter(pro => pro.type == 'FTAProject')
      const children = []
      for (let i = 0; i < ftaProject.length; i++) {
        if (
          this.props.VARS.activeNode.files.find(
            file => file.id == ftaProject[i].id
          )
        ) {
        } else {
          children.push(
            <Option key={ftaProject[i].id}>{ftaProject[i].name}</Option>
          )
        }
      }
      const FTAProps = {
        ...this.props.VARS.activeNode,
        unBind: a => {
          this.props.dispatch({ type: 'VARS/unBindProject', payload: a })
        },
      }
      return (
        <div>
          <Row className={styles.project}>
            <Col span={12} className={styles.title}>
              FTA文件列表
            </Col>
            <Col span={5} offset={3}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                onChange={e => this.handleChange(e)}
                value={this.props.VARS.selectForAdd}
              >
                {children}
              </Select>
            </Col>
            <Col span={3} className={styles.addBtn}>
              <Button
                disabled={this.props.VARS.selectForAdd.length == 0}
                onClick={e => this.addProectLink(e)}
              >
                添加FTA
              </Button>
            </Col>
            <Col span={24} className={styles.table}>
              <TemplateFile {...FTAProps} />
            </Col>
          </Row>
        </div>
      )
    } else {
      let templateFile = this.props.VARS.activeNode
        ? {
            files: this.props.VARS.activeNode.files.filter(
              file => file.privilege == 0
            ),
          }
        : null
      const templateProps = {
        ...templateFile,
        download: a => {
          this.props.dispatch({ type: 'VARS/download', payload: a })
        },
        delete: a => {
          this.props.dispatch({ type: 'VARS/delete', payload: a })
        },
      }
      let projectFile = this.props.VARS.activeNode
        ? {
            files: this.props.VARS.activeNode.files.filter(
              file => file.privilege == 1
            ),
          }
        : null
      const projectProps = {
        ...projectFile,
        download: a => {
          this.props.dispatch({ type: 'VARS/download', payload: a })
        },
        delete: a => {
          projectProps.spin = true
          this.props.dispatch({ type: 'VARS/delete', payload: a })
        },
      }
      return (
        <div>
          <Row className={styles.project}>
            <Col span={14} className={styles.title}>
              模板文件列表
            </Col>
            <Col span={10}>
              {isAdmin == 'Administrator' && (
                <UploadCon {...this.props} level={true} />
              )}
            </Col>
            <Col span={24} className={styles.table}>
              {templateFile != null && <ProjectFile {...templateProps} />}
            </Col>
          </Row>
          <Row className={styles.template}>
            <Col span={14} className={styles.title}>
              项目文件列表
            </Col>
            <Col span={10}>
              <UploadCon {...this.props} />
            </Col>
            <Col span={24} className={styles.table}>
              {projectFile != null && <ProjectFile {...projectProps} />}
            </Col>
          </Row>
        </div>
      )
    }
  }
}
export default ProjectPage
