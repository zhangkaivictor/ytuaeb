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
    console.log(viewData)
    return (
      <Col span={24} className={styles.view}>
        {viewData != null && (
          <GGEditor>
            <Mind style={{ height: 300 }} data={viewData} />
          </GGEditor>
        )}
      </Col>
    )
  }
}

export default withPropsAPI(ViewPage)
