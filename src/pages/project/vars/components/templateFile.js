import React from 'react'
import { Table, Popconfirm } from 'antd'
import router from 'umi/router'
class TemplatePage extends React.Component {
  constructor(props) {
    super(props)
  }
  goProject(record) {
    router.push(
      `/project/${record.type == 'FTAProject' ? 'FTA' : 'FMEA'}?projectId=${
        record.id
      }`
    )
  }
  text1 = 'Are you sure to unbind this project?'
  render() {
    const { files } = this.props
    console.log(this.props)
    files.forEach(element => {
      element.key = element.id
    })
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <a
            onClick={e => {
              this.goProject(record)
            }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '所有者',
        dataIndex: 'createdBy.realName',
        key: 'createdBy.realName',
      },
      {
        title: '修改时间',
        dataIndex: 'lastModfiedTime',
        key: 'lastModfiedTime',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              placement="left"
              title={this.text1}
              onConfirm={e => this.props.unBind(record)}
              okText="Yes"
              cancelText="No"
            >
              <a>解绑</a>
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
export default TemplatePage
