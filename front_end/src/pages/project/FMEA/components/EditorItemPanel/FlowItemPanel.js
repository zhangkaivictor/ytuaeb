import React from 'react'
import { Card } from 'antd'
import { ItemPanel, Item, RegisterNode } from 'gg-editor'
import styles from './index.less'

const FlowItemPanel = () => {
  return (
    <ItemPanel className={styles.itemPanel}>
      <RegisterNode
        name={'controller'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/controller.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
              },
            })
            return keyShape
          },
          setState(name, value, item) {
            const group = item.getContainer()
            const shape = group.get('children')[0] // 顺序根据 draw 时确定
            if (name === 'selected') {
              if (value) {
                shape.attr('fill', 'red')
              } else {
                shape.attr('fill', 'red')
              }
            }
          },
          update(cfg, node) {
            console.log(cfg, node)
          },
          afterUpdate(cfg, node) {
            console.log(cfg, node)
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
        name={'harness'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/harness.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
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
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
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
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
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
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
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
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'pressure_sensor'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/pressure_sensor.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'ESP'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/ESP.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'turn'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/turn.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'park_brake_system'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/park_brake_system.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'service_brake_system'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/service_brake_system.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'vehicle_front'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/vehicle_front.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'vehicle_side'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/vehicle_side.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'pressure_sensor2'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/pressure_sensor2.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'temperature'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/temperature_sensor.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'pedal'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/pedal.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'pump'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/pump.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'button'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/button.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'valve'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/valve.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'clutch'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/clutch.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'relay'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/relay.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'shift_control_unit'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/shift_control_unit.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'fan'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/fan.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'cruise_control'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/cruise_control.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'engine'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/engine.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'voltage_current_sensor'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/voltage_current_sensor.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'battery'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/battery.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'gearbox'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/gearbox.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
        name={'motor'}
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
                stroke: model.root ? 'red' : '',
                fill: model.root ? 'red' : '',
              },
            })
            group.addShape('image', {
              attrs: {
                img: '/motor.png',
                x,
                y,
                width,
                height,
              },
            })
            group.addShape('text', {
              attrs: {
                x: 0,
                y: 40,
                textAlign: 'center',
                text: model.label,
                fill: '#444',
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
          shape="controller"
          model={{
            color: '#FA8C16',
            label: '芯片，CPU',
          }}
          src="/controller.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="harness"
          model={{
            color: '#1890FF',
            label: '服务编排-连接线',
          }}
          src="/harness.png"
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
        <Item
          type="node"
          size="80*48"
          shape="pressure_sensor"
          model={{
            color: '#722ED1',
            label: '压力传感器',
          }}
          src="/pressure_sensor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="pressure_sensor2"
          model={{
            color: '#722ED1',
            label: '压力传感器',
          }}
          src="/pressure_sensor2.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="battery"
          model={{
            color: '#722ED1',
            label: '电池',
          }}
          src="/battery.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="service_brake_system"
          model={{
            color: '#722ED1',
            label: '制动系统',
          }}
          src="/service_brake_system.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="clutch"
          model={{
            color: '#722ED1',
            label: '离合器',
          }}
          src="/clutch.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="ESP"
          model={{
            color: '#722ED1',
            label: 'ESP',
          }}
          src="/ESP.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="cruise_control"
          model={{
            color: '#722ED1',
            label: '定速巡航',
          }}
          src="/cruise_control.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="motor"
          model={{
            color: '#722ED1',
            label: '电机',
          }}
          src="/motor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="fan"
          model={{
            color: '#722ED1',
            label: '风扇',
          }}
          src="/fan.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="engine"
          model={{
            color: '#722ED1',
            label: '发动机',
          }}
          src="/engine.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="pedal"
          model={{
            color: '#722ED1',
            label: '踏板',
          }}
          src="/pedal.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="gearbox"
          model={{
            color: '#722ED1',
            label: '变速箱',
          }}
          src="/gearbox.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="shift_control_unit"
          model={{
            color: '#722ED1',
            label: '换挡杆',
          }}
          src="/shift_control_unit.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="park_brake_system"
          model={{
            color: '#722ED1',
            label: '驻车',
          }}
          src="/park_brake_system.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="relay"
          model={{
            color: '#722ED1',
            label: '继电器',
          }}
          src="/relay.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="button"
          model={{
            color: '#722ED1',
            label: '启动按钮',
          }}
          src="/button.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="temperature"
          model={{
            color: '#722ED1',
            label: '温度传感器',
          }}
          src="/temperature_sensor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="steering_system"
          model={{
            color: '#722ED1',
            label: '转向',
          }}
          src="/steering_system.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="valve"
          model={{
            color: '#722ED1',
            label: '阀',
          }}
          src="/valve.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="vehicle_front"
          model={{
            color: '#722ED1',
            label: '整车',
          }}
          src="/vehicle_front.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="vehicle_side"
          model={{
            color: '#722ED1',
            label: '整车',
          }}
          src="/vehicle_side.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="voltage_current_sensor"
          model={{
            color: '#722ED1',
            label: '电流电压传感器',
          }}
          src="/voltage_current_sensor.png"
        />
        <Item
          type="node"
          size="80*48"
          shape="pump"
          model={{
            color: '#722ED1',
            label: '水泵',
          }}
          src="/pump.png"
        />
      </Card>
    </ItemPanel>
  )
}

export default FlowItemPanel
