import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { router } from 'utils'
import { Table, Avatar, Tabs } from 'antd'
import { Page } from 'components'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import { Ellipsis } from 'ant-design-pro'
import styles from './onAnalysis.less'
const { TabPane } = Tabs

@withI18n()
@connect(({ FTA }) => ({ FTA }))
class onAnalysis extends PureComponent {

  renderFailureNameContent = (value, row, index) => {
    const { FTA } = this.props
    const { treeReportList } = FTA
    let { tableP2 } = treeReportList
    const obj = {
      children: value,
      props: {},
    }
    let tableList = []
    for (let i = 0; i <= tableP2.length - 1; i++) {
      if (tableP2[i].failureName == value) {
        tableList.push(i)
      }
    }
    if (tableList.length === 1) {
      obj.props.rowSpan = 1
    } else {
      if (index === tableList[0]) {
        obj.props.rowSpan = tableList[tableList.length - 1] - tableList[0] + 1
      } else {
        for (let j = 1; j <= tableList.length - 1; j++) {
          if (index === tableList[j]) {
            obj.props.rowSpan = 0
          }
        }
      }
    }
    return obj
  }

  renderInvalidValueContent = (value, row, index) => {
    const { FTA } = this.props
    const { treeReportList } = FTA
    let { tableP2 } = treeReportList
    const obj = {
      children: value,
      props: {},
    }
    let tableList = []
    for (let i = 0; i <= tableP2.length - 1; i++) {
      if (tableP2[i].failureName == tableP2[index].failureName) {
        tableList.push(i)
      }
    }
    if (tableList.length === 1) {
      obj.props.rowSpan = 1
    } else {
      if (index === tableList[0]) {
        obj.props.rowSpan = tableList[tableList.length - 1] - tableList[0] + 1
      } else {
        for (let j = 1; j <= tableList.length - 1; j++) {
          if (index === tableList[j]) {
            obj.props.rowSpan = 0
          }
        }
      }
    }
    return obj
  }
  render() {
    const { FTA,location,dispatch } = this.props;
    console.log(this.props)
    let reportList;
    if(FTA.treeReportList !== undefined){
      reportList = FTA.treeReportList
    }
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
      } = reportList
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
          dataIndex: 'singlePointFault',
        },

        {
          title: '残余故障',
          dataIndex: 'residualFaults',
        },
        {
          title: '潜伏故障',
          dataIndex: 'latentFault',
        },
        {
          title: '可探测双点故障',
          dataIndex: 'detectedDualPointFault',
        },
        {
          title: '安全故障',
          dataIndex: 'safeFault',
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
          render: this.renderFailureNameContent,
        },
        {
          title: '失效率',
          dataIndex: 'invalidValue',
          render: this.renderInvalidValueContent,
        },
        {
          title: '事件ID',
          dataIndex: 'nodeId',
        },

        {
          title: '事件名',
          dataIndex: 'nodeName',
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
      const callback = () => {}
      return (
        <Page inner>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="结果 1" key="1">
              <Table
                dataSource={topTable}
                pagination={false}
                columns={columnsTop}
                bordered
                scroll={{ x: 1200 }}
                className={styles.table}
                simple
              />
            </TabPane>
            <TabPane tab="结果 2" key="2">
              <Table
                dataSource={tableP1}
                bordered
                pagination={false}
                scroll={{ x: 1200 }}
                className={styles.table}
                simple
                columns={columns}
                rowKey={record => record.id}
              />
            </TabPane>
            <TabPane tab="结果 3" key="3">
              <Table
                dataSource={tableP2}
                pagination={false}
                columns={columns2}
                bordered
                scroll={{ x: 1200 }}
                className={styles.table}
                simple
              />
            </TabPane>
          </Tabs>
          ,
        </Page>
      )
  }
}

export default onAnalysis
