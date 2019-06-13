import React from 'react'
import { Card } from 'antd'
import { ItemPanel, Item, RegisterNode, RegisterEdge } from 'gg-editor'
import styles from './index.less'

class EditorItemPanel extends React.Component {
  render() {
    const { isHideScreen } = this.props
    // console.log(isHideScreen)
    return (
      <ItemPanel className={styles.itemPanel}>
        <RegisterNode
          name="andGate"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const width = 64
              const height = 60
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
                  stroke: '#1890FF',
                },
              })
              group.addShape('image', {
                attrs: {
                  img: '/or.png',
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
            ],
          }}
        />
        <RegisterNode
          name="orGate"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const width = 64
              const height = 60
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
                  stroke: '#1890FF',
                },
              })
              group.addShape('image', {
                attrs: {
                  img: '/versus.png',
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
            ],
          }}
        />
        <RegisterNode
          name="nonGate"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const width = 64
              const height = 60
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
                  stroke: '#1890FF',
                },
              })
              //logo注册
              group.addShape('image', {
                attrs: {
                  img: '/non.png',
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
            ],
          }}
        />
        <RegisterNode
          name="square"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const model = item.getModel()
              const width = 60
              const height = 60
              const x = -width / 2
              const y = -height / 2
              const borderRadius = 4
              const color = model.color ? model.color : '#1890FF'
              console.log(color)
              const keyShape = group.addShape('rect', {
                attrs: {
                  x,
                  y,
                  width,
                  height,
                  radius: borderRadius,
                  fill: color,
                  stroke: color,
                },
              })
              //注册文本信息
              const name = model.name ? model.name : this.name
              group.addShape('text', {
                attrs: {
                  text: name,
                  x: x + 30,
                  y: y + 30,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: 'rgba(0,0,0,0.65)',
                },
              })

              //注册注释信息
              if (model.checkDis) {
                //注释注册
                group.addShape('rect', {
                  attrs: {
                    x: x - 10,
                    y: y - 40,
                    width: 90,
                    height: 34,
                    fill: 'white',
                    stroke: '#1890FF',
                    radius: borderRadius,
                    overFlow: 'hidden',
                  },
                })
                const note = model.note ? model.note : this.note
                group.addShape('text', {
                  attrs: {
                    text: note,
                    x: x + 32,
                    y: y - 20,
                    width,
                    height,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fill: 'rgba(0,0,0,0.65)',
                  },
                })
              }
              return keyShape
            },
            // 设置锚点
            anchor: [
              [0.5, 0],
              [0.5, 1], // 下边边的中点
            ],
          }}
        />
        <RegisterNode
          name="rectangle"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const model = item.getModel()
              const width = 88
              const height = 46
              const x = -width / 2
              const y = -height / 2
              const borderRadius = 4
              const color = model.color ? model.color : '#1890FF'
              const keyShape = group.addShape('rect', {
                attrs: {
                  x,
                  y,
                  width,
                  height,
                  radius: borderRadius,
                  fill: color,
                  stroke: color,
                },
              })
              //注册文本信息
              const name = model.name ? model.name : this.name
              group.addShape('text', {
                attrs: {
                  text: name,
                  x: x + 40,
                  y: y + 24,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: 'rgba(0,0,0,0.65)',
                },
              })

              //注册注释信息
              if (model.checkDis) {
                //注释注册
                group.addShape('rect', {
                  attrs: {
                    x,
                    y: y - 60,
                    width: 90,
                    height: 34,
                    fill: 'white',
                    stroke: '#1890FF',
                    radius: borderRadius,
                    overFlow: 'hidden',
                  },
                })
                const note = model.note ? model.note : this.note
                group.addShape('text', {
                  attrs: {
                    text: note,
                    x: x + 40,
                    y: y - 40,
                    width,
                    height,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fill: 'rgba(0,0,0,0.65)',
                  },
                })
              }

              return keyShape
            },
            // 设置锚点
            anchor: [
              [0.5, 0],
              [0.5, 1], // 下边边的中点
            ],
          }}
        />
        <RegisterNode
          name="round"
          config={{
            draw(item) {
              const group = item.getGraphicGroup()
              const model = item.getModel()
              const width = 68
              const height = 68
              const x = -width / 2
              const y = -height / 2
              const borderRadius = 34
              const color = model.color ? model.color : '#1890FF'
              console.log(color)
              const keyShape = group.addShape('rect', {
                attrs: {
                  x,
                  y,
                  width,
                  height,
                  fill: color,
                  stroke: color,
                  radius: borderRadius,
                },
              })
              //注册文本信息
              const name = model.name ? model.name : this.name
              group.addShape('text', {
                attrs: {
                  text: name,
                  x: x + 32,
                  y: y + 35,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fill: 'rgba(0,0,0,0.65)',
                },
              })

              //注册注释信息
              if (model.checkDis) {
                //注释注册
                group.addShape('rect', {
                  attrs: {
                    x: x - 5,
                    y: y - 50,
                    width: 90,
                    height: 34,
                    fill: 'white',
                    stroke: '#1890FF',
                    overFlow: 'hidden',
                  },
                })
                const note = model.note ? model.note : this.note
                group.addShape('text', {
                  attrs: {
                    text: note,
                    x: x + 40,
                    y: y - 30,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fill: 'rgba(0,0,0,0.65)',
                  },
                })
              }

              return keyShape
            },
            // 设置锚点
            anchor: [
              [0.5, 0],
              [0.5, 1], // 下边边的中点
            ],
          }}
        />
        <Card
          bordered={false}
          title="操作节点"
          type="inner"
          headStyle={{ backgroundColor: '#e5e5e5' }}
        >
          <Item
            type="node"
            size="40*40"
            shape="square"
            model={{
              color: '#1890FF',
              name: 'F000',
              note: '根节点注释',
              checkDis: isHideScreen,
              itemType: 'square',
              failureRateQ: 0,
              invalidRate: 0,
              failureTime: 5000,
              dCrf: 0,
              dClf: 0,
              smallFailureRateQ: 0,
              invalidRateValueIsModifiedByUser: false,
              smallFailureRateQValueType: false,
            }}
            src="/square.png"
          />
          <Item
            type="node"
            size="60*28"
            shape="rectangle"
            model={{
              color: '#1890FF',
              name: 'C000', //center
              note: '中间节点注释',
              checkDis: isHideScreen,
              itemType: 'rectangle',
              failureRateQ: 0,
              invalidRate: 0,
              failureTime: 5000,
              dCrf: 0,
              dClf: 0,
              smallFailureRateQ: 0,
              invalidRateValueIsModifiedByUser: false,
              smallFailureRateQValueType: false,
            }}
            src="/rectangle.png"
            className={styles.rectangle}
          />
          <Item
            type="node"
            size="68*68"
            shape="round"
            model={{
              color: '#1890FF',
              name: 'E000',
              note: '叶子节点注释',
              checkDis: isHideScreen,
              itemType: 'round',
              failureRateQ: 0,
              invalidRate: 0,
              failureTime: 5000,
              dCrf: 0,
              dClf: 0,
              smallFailureRateQ: 0,
              invalidRateValueIsModifiedByUser: false,
              smallFailureRateQValueType: false,
            }}
            src="/round.png"
          />
          <Item
            type="node"
            size="80*72"
            shape="orGate"
            model={{
              name: 'orGate',
              color: '#1890FF',
              itemType: 'orGate',
            }}
            src="/versus.png"
          />
          <Item
            type="node"
            size="80*72"
            shape="andGate"
            model={{
              name: 'andGate',
              color: '#1890FF',
              itemType: 'andGate',
            }}
            src="/or.png"
          />
          <Item
            type="node"
            size="80*72"
            shape="nonGate"
            model={{
              name: 'nonGate',
              color: '#1890FF',
              itemType: 'nonGate',
            }}
            src="/non.png"
          />
        </Card>
      </ItemPanel>
    )
  }
}

export default EditorItemPanel
