import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { router } from 'utils'
import { Table, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import { Ellipsis } from 'ant-design-pro'
import styles from './onAnalysis.less'
@withI18n()
@connect(({ FTA }) => ({ FTA }))
class onAnalysis extends PureComponent {
  render() {
    const { FTA, location } = this.props
    console.log(FTA)
    if (FTA.list.length <= 0) {
      router.push({
        pathname: '/project/FTA',
        query: {
          projectId: location.query.projectId,
        },
      })
      return
    } else {
      const { FTA } = this.props
      const { treeReportList } = FTA
      const {
        tableP1,
        tableP2,
        topEventNames,
        singlePointEventNames,
        minimalCutSetNames,
        baseEventNames,
        singlePointFaultMeasure,
        randomFaultMeasure,
        dualPointEventNames,
        latentFaultMeasure,
        safeEventNames,
      } = treeReportList
      const columns = [
        {
          title: '事件ID',
          dataIndex: 'nodeId',
        },
        {
          title: '事件名',
          dataIndex: 'nodeName',
        },
        {
          title: '事件类型',
          dataIndex: 'eventName',
        },
        {
          title: '单点故障',
          dataIndex: 'dualPointEvent',
        },

        {
          title: '残余故障',
          dataIndex: 'nodeFailureProbability',
        },
        {
          title: '潜伏故障',
          dataIndex: 'safeEvent',
        },
        {
          title: '可探测双点故障',
          dataIndex: 'singlePointEvent',
        },
        {
          title: '安全故障',
          dataIndex: 'topEvent',
        },
      ]
      const columnsTop = [
        {
          title: '统计分类',
          dataIndex: 'name',
        },
        {
          title: '统计值',
          dataIndex: 'type',
        },
      ]
      const columns2 = [
        {
          title: '故障类型',
          dataIndex: 'failureName',
        },
        {
          title: '失效率',
          dataIndex: 'invalidValue',
        },
        {
          title: '事件编号',
          dataIndex: 'nodeName',
        },

        {
          title: '事件名',
          dataIndex: 'eventName',
        },
        {
          title: '故障率',
          dataIndex: 'failureValue',
        },
      ]
      let topTable = [
        {
          type: topEventNames,
          name: '顶事件',
        },
        {
          type: baseEventNames,
          name: '底事件',
        },
        {
          type: minimalCutSetNames,
          name: '最小割集',
        },
        {
          type: singlePointEventNames,
          name: '单点事件',
        },
        {
          type: dualPointEventNames,
          name: '双点事件',
        },
        {
          type: safeEventNames,
          name: '安全事件',
        },
        {
          type: singlePointFaultMeasure,
          name: '单点故障度量',
        },
        {
          type: latentFaultMeasure,
          name: '潜伏故障度量',
        },
        {
          type: randomFaultMeasure,
          name: '随机故障度量',
        },
      ]
      return (
        <div>
          <Table
            dataSource={topTable}
            columns={columnsTop}
            bordered
            scroll={{ x: 1200 }}
            className={styles.table}
            simple
          />
          <Table
            dataSource={tableP1}
            bordered
            scroll={{ x: 1200 }}
            className={styles.table}
            simple
            columns={columns}
            rowKey={record => record.id}
          />
          <Table
            dataSource={tableP2}
            columns={columns2}
            bordered
            scroll={{ x: 1200 }}
            className={styles.table}
            simple
          />
        </div>
      )
    }
  }
}

export default onAnalysis
