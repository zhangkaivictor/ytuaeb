import React from 'react'
import GGEditor, { Mind, withPropsAPI, Command, NodeMenu, RegisterNode } from 'gg-editor'
import CustomNode from './shape/nodes/customNode'
import ContextMenu from './EditorContextMenu/MindContextMenu'
import { Col } from 'antd'
import styles from './viewPage.less'

class ViewPage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    // console.log(this.props.propsAPI.read());
  }

  render() {
    let viewData = null
    const getViewData = () => {
      if (this.props.FMEA.selectedStructure === null) {
        return
      }
      if (
        this.props.FMEA.actionType == 1 &&
        this.props.FMEA.selectedFun !== null
      ) {
        let treeData = this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
          this.props.FMEA.selectedStructure.id,
          this.props.FMEA.selectedFun.id
        )
        viewData = treeData
          ? {
            roots: [
              {
                label:
                  this.props.FMEA.selectedStructure.name +
                  '--' +
                  this.props.FMEA.selectedFun.name,
                children: this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
                  this.props.FMEA.selectedStructure.id,
                  this.props.FMEA.selectedFun.id
                ).leftChilds.concat(
                  this.props.FMEA.StructurePane.GetStructureFunctionDepTree(
                    this.props.FMEA.selectedStructure.id,
                    this.props.FMEA.selectedFun.id
                  ).rightChilds
                ),
              },
            ],
          }
          : null
      } else if (
        this.props.FMEA.actionType == 2 &&
        this.props.FMEA.selectedFail !== null
      ) {
        let treeData = this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
          this.props.FMEA.selectedStructure.id,
          this.props.FMEA.selectedFun.id,
          this.props.FMEA.selectedFail.id
        )
        viewData = treeData
          ? {
            roots: [
              {
                label:
                  this.props.FMEA.selectedStructure.name +
                  '--' +
                  this.props.FMEA.selectedFun.name +
                  '--' +
                  this.props.FMEA.selectedFail.name,
                oValue: this.props.FMEA.selectedFail.oValue,
                sValue: this.props.FMEA.selectedFail.sValue,
                dValue: this.props.FMEA.selectedFail.dValue,
                lambdaValue: this.props.FMEA.selectedFail.lambdaValue,
                children: this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
                  this.props.FMEA.selectedStructure.id,
                  this.props.FMEA.selectedFun.id,
                  this.props.FMEA.selectedFail.id
                ).leftChilds.concat(
                  this.props.FMEA.StructurePane.GetFunctionFailureDepTree(
                    this.props.FMEA.selectedStructure.id,
                    this.props.FMEA.selectedFun.id,
                    this.props.FMEA.selectedFail.id
                  ).rightChilds
                ),
              },
            ],
          }
          : null
      }
    }
    getViewData()
    let graph = {
      // defaultNode: {
      //   size: 16,
      //   anchorPoints: [[0, 0.5], [1, 0.5]]
      // },
      // defaultEdge: {
      //   shape: 'flow-smooth'
      // },
      // nodeStyle: {
      //   default: {
      //     fill: 'red',
      //     stroke: '#096dd9'
      //   }
      // },
      // edgeStyle: {
      //   default: {
      //     stroke: '#A3B1BF'
      //   }
      // },
      edgeDefaultShape: 'flow-polyline-round',
      // nodeDefaultShape:'custom-node' ,
      // defaultNode: {
      //   shape:'custom-node'
      // }
      // layout: function layout(data) {
      //   return Hierarchy.mindmap(data, {
      //     direction: 'H',
      //     getHeight: function getHeight() {
      //       return 16;
      //     },
      //     getWidth: function getWidth() {
      //       return 16;
      //     },
      //     getVGap: function getVGap() {
      //       return 10;
      //     },
      //     getHGap: function getHGap() {
      //       return 100;
      //     }
      //   });
      // }
    }

    return (
      <Col span={24} className={styles.view}>
        {viewData != null && (
          <GGEditor>
            {/* <Mind style={{ height: 300 }} graph={graph } data={viewData} rootShape="mind-root" firstSubShape="custom-node" /> */}
            <Mind
              style={{ height: 300 }}
              graph={graph}
              data={viewData}
              rootShape="mind-root"
              firstSubShape="custom-node"
              secondSubShape="custom-node"
              thirdSubShape="custom-node"
              fouthSubShape="custom-node"
              fifthSubShape="custom-node"
            />
            <CustomNode />
            <ContextMenu/>
          </GGEditor>
        )}
      </Col>
    )
  }
}

export default withPropsAPI(ViewPage)
