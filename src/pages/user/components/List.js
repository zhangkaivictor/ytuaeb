import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

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
  changeStatus = value => {
    if (value == '正常') {
      return '1'
    } else {
      return '2'
    }
  }
  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props
    const columns = [
      {
        title: <Trans>Email</Trans>,
        dataIndex: 'emailAddress',
        key: 'emailAddress',
      },
      {
        title: <Trans>Name</Trans>,
        dataIndex: 'realName',
        key: 'realName',
        // render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      },
      {
        title: <Trans>Phone</Trans>,
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: <Trans>Status</Trans>,
        dataIndex: 'status',
        key: 'status',
        render: dataIndex => (dataIndex == '1' ? '正常' : '冻结'),
      },
      {
        title: <Trans>Note</Trans>,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: <Trans>CreateTime</Trans>,
        dataIndex: 'createdTime',
        key: 'createdTime',
      },
      {
        title: <Trans>CheckTime</Trans>,
        dataIndex: 'lastModfiedTime',
        key: 'lastModfiedTime',
      },

      {
        title: <Trans>Operation</Trans>,
        key: 'operation',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: '修改信息' },
                { key: '2', name: '修改密码' },
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
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
