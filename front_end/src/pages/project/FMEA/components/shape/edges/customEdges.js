// import React, { Fragment } from "react";
// import { RegisterEdeg } from "gg-editor";
// import { getRectPath } from "../../utils";

// const ICON_URL = "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg";
// const ICON_SIZE = 16;
// const ICON_SPAN = 5;

// class CustomEdegs extends React.Component {
//   render() {
//     const rootcConfig = {
//       // 绘制标签
//       // drawLabel(item) {},

//       // 绘制图标
//       afterDraw(item) {
//         const model = item.getModel();
//         const group = item.getGraphicGroup();

//         const label = group.findByClass("label")[0];
//         const labelBox = label.getBBox();

//         group.addShape("image", {
//           attrs: {
//             x: labelBox.width / 2 + ICON_SPAN,
//             y: -labelBox.height / 2,
//             width: ICON_SIZE,
//             height: ICON_SIZE,
//             img: model.icon || ICON_URL
//           }
//         });
//       },

//       // 对齐标签
//       adjustLabelPosition(item, labelShape) {
//         const size = this.getSize(item);
//         const padding = this.getPadding();
//         const width = size[0];
//         const labelBox = labelShape.getBBox();

//         labelShape.attr({
//           x: -width / 2 + padding[3],
//           y: -labelBox.height / 2
//         });
//       },

//       // 内置边距
//       // [上, 右, 下, 左]
//       getPadding() {
//         return [4, 8, 4, 8];
//       },

//       // 标签尺寸
//       // [宽, 高]
//       getSize(item) {
//         const group = item.getGraphicGroup();

//         const label = group.findByClass("label")[0];
//         const labelBox = label.getBBox();

//         const padding = this.getPadding(item);

//         return [
//           labelBox.width + padding[1] + padding[3],
//           labelBox.height + padding[0] + padding[2]
//         ];
//       },

//       // 节点路径
//       // x, y, w, h, r
//       getPath(item) {
//         const size = this.getSize(item);
//         const style = this.getStyle(item);

//         return getRectPath(
//           -size[0] / 2,
//           -size[1] / 2,
//           size[0] + ICON_SIZE + ICON_SPAN,
//           size[1],
//           style.radius
//         );
//       },

//       // 节点样式
//       getStyle(item) {
//         return {
//           fill: "#ff4470",
//           fillOpacity: 0,
//           radius: 4,
//           lineWidth: 2
//         };
//       },

//       // 标签样式
//       getLabelStyle(item) {
//         return {
//           fill: "#333333",
//           lineHeight: 18,
//           fontSize: 16
//         };
//       },

//       // 激活样式
//       getActivedStyle(item) {
//         return {
//           stroke: "#44C0FF",
//           lineWidth: 2
//         };
//       },

//       // 选中样式
//       getSelectedStyle(item) {
//         return {
//           stroke: "#1AA7EE",
//           lineWidth: 2
//         };
//       }
//     };
//     const config = {
//       // 绘制标签
//       // drawLabel(item) {},

//       // 绘制图标
//       afterDraw(item) {
//         const model = item.getModel();
//         const group = item.getGraphicGroup();

//         const label = group.findByClass("label")[0];
//         const labelBox = label.getBBox();

//         group.addShape("image", {
//           attrs: {
//             x: labelBox.width / 2 + ICON_SPAN,
//             y: -labelBox.height / 2,
//             width: ICON_SIZE,
//             height: ICON_SIZE,
//             img: model.icon || ICON_URL
//           }
//         });
//       },

//       // 对齐标签
//       adjustLabelPosition(item, labelShape) {
//         const size = this.getSize(item);
//         const padding = this.getPadding();
//         const width = size[0];
//         const labelBox = labelShape.getBBox();

//         labelShape.attr({
//           x: -width / 2 + padding[3],
//           y: -labelBox.height / 2
//         });
//       },

//       // 内置边距
//       // [上, 右, 下, 左]
//       getPadding() {
//         return [4, 8, 4, 8];
//       },

//       // 标签尺寸
//       // [宽, 高]
//       getSize(item) {
//         const group = item.getGraphicGroup();

//         const label = group.findByClass("label")[0];
//         const labelBox = label.getBBox();

//         const padding = this.getPadding(item);

//         return [
//           labelBox.width + padding[1] + padding[3],
//           labelBox.height + padding[0] + padding[2]
//         ];
//       },

//       // 节点路径
//       // x, y, w, h, r
//       getPath(item) {
//         const size = this.getSize(item);
//         const style = this.getStyle(item);

//         return getRectPath(
//           -size[0] / 2,
//           -size[1] / 2,
//           size[0] + ICON_SIZE + ICON_SPAN,
//           size[1],
//           style.radius
//         );
//       },

//       // 节点样式
//       getStyle(item) {
//         console.log(item)
//         return {
//           fill: "#ff4470",
//           fillOpacity: 0,
//           radius: 4,
//           lineWidth: 2
//         };
//       },

//       // 标签样式
//       getLabelStyle(item) {
//         return {
//           fill: "#333333",
//           lineHeight: 18,
//           fontSize: 16
//         };
//       },

//       // 激活样式
//       getActivedStyle(item) {
//         return {
//           stroke: "#44C0FF",
//           lineWidth: 2
//         };
//       },

//       // 选中样式
//       getSelectedStyle(item) {
//         return {
//           stroke: "#1AA7EE",
//           lineWidth: 2
//         };
//       }
//     };
//     return (
//       <Fragment>
//         <RegisterNode name="mind-root" config={config} extend={"mind-base"} />
//         <RegisterNode name="mind-base" config={config} extend={"mind-base"} />
//         <RegisterNode name="custom-node" config={config} extend={"mind-base"} />
//       </Fragment>
//     );
//   }
// }

// export default CustomEdegs;
