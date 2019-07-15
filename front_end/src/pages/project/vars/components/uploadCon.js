import React from 'react'
import { Form, Upload, Button, Icon, Select, Row, Col } from 'antd'
// import reqwest from 'reqwest';
const { Option } = Select
// function handleChange(value) {
//   console.log(`selected ${value}`);
//   console.log(value.join('|'));
//   this.setState({
//     level: value.join('|'),
//   })
// }
class UploadCon extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    fileList: [],
    uploading: false,
    level: [],
    defaultLevel: [],
  }

  handleUpload = async () => {
    const { fileList, level } = this.state
    this.setState({
      uploading: true,
    })
    this.props.dispatch({
      type: 'VARS/updateFile',
      payload: { fileList: fileList, level: level },
      callback: res => {
        if (res == 'success') {
          this.setState({
            fileList: [],
            defaultLevel: [],
            uploading: false,
          })
        } else {
          this.setState({
            uploading: false,
            defaultLevel: [],
          })
        }
      },
    })
  }
  handleChange(value) {
    let formatLevel = value.map(v => Number(v))
    this.setState({
      level: `${JSON.stringify(formatLevel)}`,
      defaultLevel: value,
    })
  }
  render() {
    //下拉level
    const children = []
    let dictionary = JSON.parse(sessionStorage.getItem('dictionary'))
      ? JSON.parse(sessionStorage.getItem('dictionary'))
      : []
    for (let i = 0; i < dictionary.length; i++) {
      children.push(
        <Option key={dictionary[i].dictValue}>{dictionary[i].dictName}</Option>
      )
    }
    const { uploading, fileList } = this.state
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: async file => {
        let reader = new FileReader()
        await reader.readAsDataURL(file)
        let inputdata = {}
        reader.onload = function(e) {
          inputdata.FileContent = reader.result.split(',')[1]
        }
        // inputdata.ProjectId = this.props.VARS.projectContent.id
        // inputdata.TartgetPath = this.props.VARS.activeNode.path;
        inputdata.cmd = 'uploadFile'
        inputdata.Name = file.name
        inputdata.name = file.name
        inputdata.uid = file.uid
        this.setState(state => ({
          fileList: [...state.fileList, inputdata],
        }))
        return false
      },
      fileList,
    }
    return (
      <Row type="flex" justify="end">
        <Col span={6}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
        </Col>
        {this.props.level && (
          <Col span={8}>
            <Select
              mode="multiple"
              value={this.state.defaultLevel}
              disabled={fileList.length === 0}
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={e => this.handleChange(e)}
            >
              {children}
            </Select>
          </Col>
        )}
        <Col span={6}>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={
              fileList.length === 0 ||
              (this.props.level && this.state.level.length == 0)
            }
            loading={uploading}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </Col>
      </Row>
    )
  }
}
export default UploadCon
