import React from 'react'
import { Table, Divider, Popconfirm, message, Button } from 'antd'
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  text1 = 'Are you sure to delete this file?'
  render() {
    const { files } = this.props
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
        render: text => <span>{parseInt(text / 1024) + 'K'}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={e => this.props.download(record)}>下载</a>
            <Divider type="vertical" />
            {/* <a onClick={e => this.props.delete(record)}>删除</a> */}
            <Popconfirm
              placement="left"
              title={this.text1}
              onConfirm={e => this.props.delete(record)}
              okText="Yes"
              cancelText="No"
            >
              <a disabled={!this.props.operateAccess}>删除</a>
            </Popconfirm>
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
