import React from 'react'
import { Upload, Button, Icon, Select, Row, Col } from 'antd'
// import reqwest from 'reqwest';
const { Option } = Select
const children = []
for (let i = 0; i < 10; i++) {
  let v = Math.pow(2, i)
  children.push(<Option key={v}>{`Level${i}`}</Option>)
}
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
    console.log(props)
  }
  state = {
    fileList: [],
    uploading: false,
    level: 0,
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
            uploading: false,
          })
        } else {
          this.setState({
            uploading: false,
          })
        }
      },
    })
  }
  handleChange(value) {
    console.log(value)
    this.setState({
      level: value.join('|'),
    })
  }
  render() {
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
            disabled={fileList.length === 0 || this.state.level == ''}
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
