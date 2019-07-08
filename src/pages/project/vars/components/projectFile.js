import React from 'react'
import { Table, Divider, Popconfirm, message, Button } from 'antd'
import { array } from 'prop-types'

const getLevelLabel = function(arry) {
  let dictionary = JSON.parse(sessionStorage.getItem('dictionary'))
    ? JSON.parse(sessionStorage.getItem('dictionary'))
    : []
  let array = JSON.parse(arry)
  let list = []
  array.map(v => {
    let dd = dictionary.find(dic => v == dic.dictValue)
    dd && list.push(dd.dictName)
  })
  return list.join('、')
}
class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
  }
  text1 = 'Are you sure to delete this file?'
  render() {
    console.log(this.props)
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
    const children = []
    let dictionary = JSON.parse(sessionStorage.getItem('dictionary'))
      ? JSON.parse(sessionStorage.getItem('dictionary'))
      : []
    for (let i = 0; i < dictionary.length; i++) {
      children.push({
        text: dictionary[i].dictName,
        value: dictionary[i].dictValue,
      })
    }
    if (this.props.privilege == 0) {
      columns.splice(3, 0, {
        title: '等级',
        dataIndex: 'level',
        key: 'level',
        render: text => <span>{getLevelLabel(text)}</span>,
        filters: children,
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.level.indexOf(value) > 0,
      })
    }
    return (
      <Table dataSource={files} columns={columns} bordered pagination={false} />
    )
  }
}
export default ProjectPage
