import React from 'react'
import GGEditor, { Mind, withPropsAPI, RegisterBehaviour } from 'gg-editor'
import CustomNode from './shape/nodes/customNode'
import { Col } from 'antd'
import styles from './viewPage.less'
import ContextMenu from './EditorContextMenu/MindContextMenu'

class ViewPage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    // console.log(this.props.propsAPI.read());
  }
  panelAction(c) {
    console.log(c)
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
                  label: this.props.FMEA.selectedFun.name,
                  id:this.props.FMEA.selectedFun.id,
                  structureNodeName: this.props.FMEA.selectedStructure.name,
                  t: 'fun',
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
                  label: this.props.FMEA.selectedFail.name,
                  id:this.props.FMEA.selectedFail.id,
                  structureNodeName: this.props.FMEA.selectedStructure.name,
                  t: 'fail',
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
    console.log(viewData)
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
    const panelAction = c => {
      console.log(c)
      console.log(this.props)
      if(c.command== "delete"){
        console.log(c.itemIds)
        this.props.dispatch({type:'FMEA/removeFunDepend',payload:{id:c.itemIds[0]}})
      }
    }
    const findLeftDepend=(node,id)=>{}
    return (
      <Col span={24} className={styles.view}>
        {viewData != null && (
          <GGEditor
            onAfterCommandExecute={({ command }) => {
              panelAction(command)
            }}
          >
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
            {/* <ContextMenu/> */}
            <RegisterBehaviour
              name="dblclickItemEditLabel"
              behaviour={() => {}}
            />
          </GGEditor>
        )}
      </Col>
    )
  }
}

export default withPropsAPI(ViewPage)
