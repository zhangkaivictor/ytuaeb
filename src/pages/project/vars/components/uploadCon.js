import React from 'react'
import { Upload, Button, Icon, message, Row, Col } from 'antd'
// import reqwest from 'reqwest';

class UploadCon extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  state = {
    fileList: [],
    uploading: false,
  }

  handleUpload = async () => {
    const { fileList } = this.state
    this.setState({
      uploading: true,
    })
    this.props.dispatch({
      type: 'VARS/updateFile',
      payload: fileList,
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
        inputdata.Level = 0
        inputdata.uid = file.uid
        this.setState(state => ({
          fileList: [...state.fileList, inputdata],
        }))
        return false
      },
      fileList,
    }

    return (
      <Row>
        <Col span={11}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Select File
            </Button>
          </Upload>
        </Col>
        <Col span={8}>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
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
