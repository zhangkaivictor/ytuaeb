import React from 'react'
import { Card } from 'antd'
import { ItemPanel, Item, RegisterNode } from 'gg-editor'
import styles from './index.less'

const FlowItemPanel = () => {
  return (
    <ItemPanel className={styles.itemPanel}>
      <RegisterNode
        name={'chip_cpu'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/chip_CPU.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <RegisterNode
        name={'connect'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/connect.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <RegisterNode
        name={'electric_machine'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/electric_machine.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <RegisterNode
        name={'sensor'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/sensor.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <RegisterNode
        name={'gear'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/gear.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <RegisterNode
        name={'electric_sensor'}
        config={{
          draw(item) {
            const group = item.getGraphicGroup()
            const model = item.getModel()
            const width = 45
            const height = 45
            const x = -width / 2
            const y = -height / 2
            const borderRadius = 4
            const keyShape = group.addShape('rect', {
              attrs: {
                x,
                y,
                width,
                height,
                radius: borderRadius,
                fill: 'white',
                stroke: '#CED4D9',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/electric_sensor.png',
                x,
                y,
                width,
                height,
              },
            })
            return keyShape
          },
          // 设置锚点
          anchor: [
            [0.5, 0], // 上面边的中点
            [0.5, 1], // 下边边的中点
            [0, 0.5], // 下边边的中点
            [1, 0.5], // 下边边的中点
          ],
        }}
      />
      <Card bordered={false}>
        <Item
          type="node"
          size="72*72"
          shape="chip_cpu"
          model={{
            color: '#FA8C16',
            label: '芯片，CPU',
          }}
          src="/chip_CPU.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="connect"
          model={{
            color: '#1890FF',
            label: '服务编排-连接线',
          }}
          src="/connect.png"
        />
        <Item
          type="node"
          size="80*72"
          shape="electric_machine"
          model={{
            color: '#13C2C2',
            label: '电机',
          }}
          src="/electric_machine.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="sensor"
          model={{
            color: '#722ED1',
            label: '传感器',
          }}
          src="/sensor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="gear"
          model={{
            color: '#722ED1',
            label: '齿轮',
          }}
          src="/gear.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="electric_sensor"
          model={{
            color: '#722ED1',
            label: '电流传感器',
          }}
          src="/electric_sensor.png"
        />
        {/* <Item
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
