import React, { Fragment } from 'react'
import { RegisterNode } from 'gg-editor'
import { getRectPath } from '../../utils'

const ICON_URL = '//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg'
const ICON_SIZE = 16
const ICON_SPAN = 5

class CustomNode extends React.Component {
  render() {
    const rootConfig = {
      // 绘制标签
      drawl(item) {
        const model = item.getModel()
        const group = item.getGraphicGroup()
        let { label } = item.getModel()
        if (typeof label === 'string') {
          label = {
            text: label,
            fill: '#333',
          }
        }
      },

      // 绘制图标
      afterDraw(item) {
        const model = item.getModel()
        const group = item.getGraphicGroup()

        const label = group.findByClass('label')[0]
        const labelBox = label.getBBox()
        // group.addShape('image', {
        // attrs: {
        //   x: labelBox.width / 2 + ICON_SPAN,
        //   y: -labelBox.height / 2,
        //   width: ICON_SIZE,
        //   height: ICON_SIZE,
        //   img: model.icon || ICON_URL
        // }
        // })
        // console.log(model)
        // let labell = item.getModel().label;
        // item.getModel().label=''
        // console.log(labell)
        // if (typeof labell === 'string') {
        //   label = {
        //     text: labell,
        //     fill: '#333',
        //   };
        // }
        group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            textAlign: 'center',
            text: model.structureNodeName,
            fill: 'black',
          },
        })
        if (model.sValue !== undefined) {
          let attr = `{o:${model.oValue},d:${model.dValue},λ:${model.lambdaValue},s:${model.sValue},AP:${model.AP}}`
          group.addShape('text', {
            attrs: {
              x: 10,
              y: 38,
              textAlign: 'center',
              text: attr,
              fill: '#444',
            },
          })
        }
      },

      // 对齐标签
      adjustLabelPosition(item, labelShape) {
        const size = this.getSize(item)
        const padding = this.getPadding()
        const width = size[0]
        const labelBox = labelShape.getBBox()
        const model = item.getModel()
        labelShape.attr({
          x: -width / 2 + 14,
          y: labelBox.height / 2 - 3,
          fill: model.t == 'fun' ? 'green' : 'red',
        })
      },

      // 内置边距
      // [上, 右, 下, 左]
      getPadding() {
        return [4, 8, 4, 8]
      },

      // 标签尺寸
      // [宽, 高]
      getSize(item) {
        const group = item.getGraphicGroup()

        const label = group.findByClass('label')[0]
        const labelBox = label.getBBox()

        const padding = this.getPadding(item)

        return [labelBox.width + 20, labelBox.height + padding[0] + 20]
      },

      // 节点路径
      // x, y, w, h, r
      getPath(item) {
        const size = this.getSize(item)
        const style = this.getStyle(item)

        return getRectPath(
          -size[0] / 2,
          -size[1] / 2,
          size[0] + ICON_SIZE + ICON_SPAN + 30,
          size[1],
          style.radius
        )
      },

      // 节点样式
      getStyle(item) {
        return {
          fill: '#ff4470',
          fillOpacity: 0,
          radius: 4,
          lineWidth: 2,
        }
      },

      // 标签样式
      getLabelStyle(item) {
        return {
          fill: '#333333',
          lineHeight: 18,
          fontSize: 16,
        }
      },

      // 激活样式
      getActivedStyle(item) {
        return {
          // stroke: "#44C0FF",
          // lineWidth: 2
        }
      },

      // 选中样式
      getSelectedStyle(item) {
        return {
          // stroke: "#1AA7EE",
          // lineWidth: 2
        }
      },
    }
    const config = {
      // 绘制标签
      drawl(item) {
        const model = item.getModel()
        const group = item.getGraphicGroup()
        let { label } = item.getModel()
        console.log(label)
        if (typeof label === 'string') {
          label = {
            text: label,
            fill: '#333',
          }
        }
      },

      // 绘制图标
      afterDraw(item) {
        const model = item.getModel()
        const group = item.getGraphicGroup()

        const label = group.findByClass('label')[0]
        const labelBox = label.getBBox()
        // group.addShape('image', {
        // attrs: {
        //   x: labelBox.width / 2 + ICON_SPAN,
        //   y: -labelBox.height / 2,
        //   width: ICON_SIZE,
        //   height: ICON_SIZE,
        //   img: model.icon || ICON_URL
        // }
        // })
        // let labell = item.getModel().label;
        // item.getModel().label=''
        // console.log(labell)
        // if (typeof labell === 'string') {
        //   label = {
        //     text: labell,
        //     fill: '#333',
        //   };
        // }
        // group.addShape('text', {
        //   attrs: {
        //     x: 0,
        //     y: -20,
        //     textAlign: 'center',
        //     text: labell,
        //     fill: 'red',
        //     color:'red'
        //    }
        // })
        group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            textAlign: 'center',
            text: model.structureNodeName,
            fill: 'black',
          },
        })
        if (model.sValue !== undefined) {
          let attr = `{o:${model.oValue},d:${model.dValue},λ:${model.lambdaValue},s:${model.sValue},AP:${model.AP}}`
          group.addShape('text', {
            attrs: {
              x: 10,
              y: 38,
              textAlign: 'center',
              text: attr,
              fill: '#444',
            },
          })
        }
      },

      // 对齐标签
      adjustLabelPosition(item, labelShape) {
        const size = this.getSize(item)
        const padding = this.getPadding()
        const width = size[0]
        const labelBox = labelShape.getBBox()
        const model = item.getModel()
        labelShape.attr({
          x: -width / 2 + 14,
          y: labelBox.height / 2 - 3,
          fill: model.t == 'fun' ? 'green' : 'red',
        })
      },

      // 内置边距
      // [上, 右, 下, 左]
      getPadding() {
        return [4, 8, 4, 8]
      },

      // 标签尺寸
      // [宽, 高]
      getSize(item) {
        const group = item.getGraphicGroup()

        const label = group.findByClass('label')[0]
        const labelBox = label.getBBox()

        const padding = this.getPadding(item)

        return [labelBox.width + 20, labelBox.height + padding[0] + 20]
      },

      // 节点路径
      // x, y, w, h, r
      getPath(item) {
        const size = this.getSize(item)
        const style = this.getStyle(item)

        return getRectPath(
          -size[0] / 2,
          -size[1] / 2,
          size[0] + ICON_SIZE + ICON_SPAN,
          size[1],
          style.radius
        )
      },

      // 节点样式
      getStyle(item) {
        return {
          fill: '#ff4470',
          fillOpacity: 0,
          radius: 4,
          lineWidth: 2,
        }
      },

      // 标签样式
      getLabelStyle(item) {
        return {
          fill: '#333333',
          lineHeight: 18,
          fontSize: 16,
        }
      },

      // 激活样式
      getActivedStyle(item) {
        return {
          // stroke: "#44C0FF",
          // lineWidth: 2
        }
      },

      // 选中样式
      getSelectedStyle(item) {
        return {
          // stroke: "#1AA7EE",
          // lineWidth: 2
        }
      },
    }
    return (
      <Fragment>
        <RegisterNode
          name="mind-root"
          config={rootConfig}
          extend={'mind-base'}
        />
        <RegisterNode name="mind-base" config={config} extend={'mind-base'} />
        <RegisterNode name="custom-node" config={config} extend={'mind-base'} />
      </Fragment>
    )
  }
}

export default CustomNode
