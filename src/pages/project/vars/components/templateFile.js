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
    console.log(this.props)
    files.forEach(element => {
      element.key = element.id
    })
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
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
            <a onClick={e => this.props.unBind(record)}>解绑</a>
            {/* <Divider type="vertical" />
            <a href="javascript:;">更新</a> */}
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
