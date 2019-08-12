import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import styles from './browser.less'

const status = {
  1: {
    color: Color.green,
  },
  2: {
    color: Color.red,
  },
  3: {
    color: Color.blue,
  },
  4: {
    color: Color.yellow,
  },
}

function Log({ data }) {
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      className: styles.name,
      render: (text, it) => <span dangerouslySetInnerHTML={{ __html: text }} />,
    },
    // {
    //   title: 'percent',
    //   dataIndex: 'percent',
    //   className: styles.percent,
    //   // render: (text, it) => <Tag color={status[it.status].color}>{text}%</Tag>,
    //   render: (text, it) => <Tag color={status[it.status].color}>{'type'}</Tag>,
    // },
  ]
  return (
    <div>
      <h4>系统日志</h4>
      <Table
        pagination={false}
        showHeader={false}
        columns={columns}
        rowKey={(record, key) => key}
        dataSource={data}
      />
    </div>
  )
}

Log.propTypes = {
  data: PropTypes.array,
}

export default Log
