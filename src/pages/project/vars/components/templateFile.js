import React from 'react'
import { Table, Divider } from 'antd'
import { file } from '@babel/types'
class TemplatePage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    const { files } = this.props
    console.log(files)
    const columns = [
      {
        title: '文件名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '修改时间',
        dataIndex: 'lastModfiedTime',
        key: 'lastModfiedTime',
      },
      {
        title: '大小',
        dataIndex: 'size',
        key: 'size',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;">下载</a>
            <Divider type="vertical" />
            <a href="javascript:;">更新</a>
          </span>
        ),
      },
    ]
    return (
      <Table dataSource={files} columns={columns} bordered pagination={false} />
    )
  }
}
export default TemplatePage
