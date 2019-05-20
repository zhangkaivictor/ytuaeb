import React from 'react'
import { Card } from 'antd'
import { ItemPanel, Item } from 'gg-editor'
import styles from './index.less'

const FlowItemPanel = () => {
  return (
    <ItemPanel className={styles.itemPanel}>
      <Card bordered={false}>
        <Item
          type="node"
          size="72*72"
          shape="flow-circle"
          model={{
            color: '#FA8C16',
            label: '芯片，CPU',
          }}
          src="/chip_CPU.png"
        />
        {/* <Item
          type="node"
          size="80*48"
          shape="flow-rect"
          model={{
            color: '#1890FF',
            label: '服务编排-连接线',
          }}
          src="/connect.png"
        /> */}
        <Item
          type="node"
          size="80*72"
          shape="flow-rhombus"
          model={{
            color: '#13C2C2',
            label: '电机',
          }}
          src="/electric_machine.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="flow-capsule"
          model={{
            color: '#722ED1',
            label: '传感器',
          }}
          src="/sensor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="flow-capsule"
          model={{
            color: '#722ED1',
            label: '齿轮',
          }}
          src="/gear.png"
        />
        {/* <Item
          type="node"
          size="80*48"
          shape="flow-capsule"
          model={{
            color: '#722ED1',
            label: '电流传感器',
          }}
          src="/electric_sensor.png"
        />
        
        <Item
          type="node"
          size="80*48"
          shape="flow-capsule"
          model={{
            color: '#722ED1',
            label: '压力传感器',
          }}
          src="/pressure_sensor.png"
        /> */}
      </Card>
    </ItemPanel>
  )
}

export default FlowItemPanel
