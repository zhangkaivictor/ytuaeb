import React from 'react'
import { Table, Divider, Popconfirm, message, Button } from 'antd'
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
  }
  text1 = 'Are you sure to delete this file?'
  render() {
    const { files } = this.props
    files.forEach(element => {
      element.key = element.id
    })
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
        title: '等级',
        dataIndex: 'level',
        key: 'level',
        filters: [
          {
            text: 'Level0',
            value: 0,
          },
          {
            text: 'Level1',
            value: 1,
          },
          {
            text: 'Level2',
            value: 2,
          },
          {
            text: 'Level4',
            value: 4,
          },
          {
            text: 'Level5',
            value: 5,
          },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.level === value,
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
