import React from 'react'
import { Table, Divider } from 'antd'
import { file } from '@babel/types'
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    const { files } = this.props
    console.log(files)
    files.forEach(element => {
      element.key = element.id
    })
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ]

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
export default ProjectPage
