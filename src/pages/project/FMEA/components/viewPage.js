import React from 'react'
import GGEditor, { Mind, withPropsAPI, RegisterNode } from 'gg-editor'
import { Col } from 'antd'
import styles from './viewPage.less'

class ViewPage extends React.Component {
  componentDidMount() {
    const { propsAPI } = this.props
    console.log(this.props)
    // console.log(this.props.propsAPI.read());
  }

  render() {
    let viewData = null
    const getViewData = () => {
      console.log(this.props.FMEA)
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
      defaultEdge: {
        shape: 'polyline-round',
        style: {
          stroke: 'white',
          lineWidth: 1,
          strokeOpacity: 1,
        },
      },
      defaultNode: {
        shape: 'chip_cpu',
      },
    }
    return (
      <Col span={24} className={styles.view}>
        {viewData != null && (
          <GGEditor>
            <Mind style={{ height: 300 }} data={viewData} />
            {/* <RegisterNode name={'chip_cpu'} config={{
        draw(item) {
          const group = item.getGraphicGroup();
          const model = item.getModel();
          const width = 45;
          const height = 45;
          const x = -width / 2;
          const y = -height / 2;
          const borderRadius = 4;
          const keyShape = group.addShape('rect', {
            attrs: {
              x,
              y,
              width,
              height,
              radius: borderRadius,
              fill: 'white',
              stroke: '#CED4D9'
            }
          });
          group.addShape('image', {
            attrs: {
              img: '/chip_CPU.png',
              x,
              y,
              width,
              height,
            }
          });
          return keyShape;
        },
        // 设置锚点
        anchor: [
          [0.5, 0], // 上面边的中点
          [0.5, 1], // 下边边的中点
          [0, 0.5], // 下边边的中点
          [1, 0.5] // 下边边的中点
        ]
      }} /> */}
          </GGEditor>
        )}
      </Col>
    )
  }
}

export default withPropsAPI(ViewPage)
