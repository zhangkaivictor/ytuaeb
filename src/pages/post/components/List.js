import React, { PureComponent } from 'react'
import { Table, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans,withI18n } from '@lingui/react'
import { Ellipsis } from 'ant-design-pro'
import styles from './List.less'

@withI18n()
class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onchangeItem, onEditItem } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      onchangeItem(record)
    }
  }
  render() {
    const { i18n, ...tableProps } = this.props
    const columns = [
      {
        title:'项目名称',
        dataIndex: 'name',
        render: text => (
          <Ellipsis tooltip length={30}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '所有者',
        dataIndex: 'createdBy.realName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
      },

      {
        title: '修改者',
        dataIndex: 'lastModifiedBy.realName',
      },
      {
        title: '修改时间',
        dataIndex: 'lastModfiedTime',
      },
      {
        title: '项目备注',
        dataIndex: 'description',
      },
      {
        title: '项目标签',
        dataIndex: 'tag',
      },
      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: "修改信息" },
              ]}
            />
          )
        },
      },
    ]
    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        bordered
        scroll={{ x: 1200 }}
        className={styles.table}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

export default List
