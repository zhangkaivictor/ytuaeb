import React, { Component } from 'react'
import { Tree, Icon, Button, Checkbox } from 'antd'
import FailDeatail from './failDetail'
import styles from './treePage.less'
const { TreeNode } = Tree

class TreePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { nodeType: 0 }
  }
  onSelect = (selectedKeys, info) => {
    if (!this.props.FMEA.StructurePane.structureTreeRoot) {
      alert('请设置根节点')
      return
    }
    this.props.dispatch({
      type: 'FMEA/selectKey',
      payload: { id: info.node.props.eventKey },
    })
  }
  //设置根节点
  setRoot(e) {
    this.props.dispatch({ type: 'FMEA/setRootNode' })
  }

  //添加功能
  addFun(e) {
    //打开添加功能modal
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 0 } })
  }
  //添加失效
  addFail(e) {
    if (!this.props.FMEA.selectedFun) {
      alert('请选择功能')
      return
    }
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 1 } })
  }
  //移除失效
  removeFail(e) {
    this.props.dispatch({ type: 'FMEA/removeFail' })
  }
  //添加功能依赖
  addFunDepend() {
    if (!this.props.FMEA.selectedFun) {
      alert('请选择功能')
      return
    }
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 3 } })
  }
  //添加失效依赖
  addFailDepend(e) {
    if (!this.props.FMEA.selectedFail) {
      alert('请选择失效')
      return
    }
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 2 } })
  }
  //显示按钮
  getBtnDisplay() {
    return this.prpos.FMEA.actionType
  }
  //设置根结构
  rootChange(e) {
    if (e.target.checked) {
      this.props.dispatch({ type: 'FMEA/setRootNode' })
    } else {
      this.props.dispatch({ type: 'FMEA/cancelRootNode' })
    }
  }
  render() {
    const { FMEA } = this.props
    let funList = null
    const getLeafHtml = leafs => {
      let lh = ''
      if (leafs.length == 0) {
        lh = []
      } else {
        lh = leafs.map(leaf => {
          return (
            <TreeNode
              title={leaf.name}
              key={leaf.id}
              className={styles.funNode}
              style={{ color: 'red' }}
            />
          )
        })
      }
      return lh
    }
    if (
      FMEA.selectedStructure &&
      FMEA.selectedStructure.FunctionSet.length > 0
    ) {
      funList = FMEA.selectedStructure.FunctionSet.map(fun => {
        return (
          <TreeNode title={fun.name} key={fun.id} style={{ color: 'green' }}>
            {getLeafHtml(fun.FailureSet)}
            {/* {[]} */}
          </TreeNode>
        )
      })
    }

    let rootStructureSetAble = true
    let rootStructureChecked = false
    if (
      this.props.FMEA.StructurePane &&
      this.props.FMEA.StructurePane.structureTreeRoot != null
    ) {
      if (
        this.props.FMEA.selectedStructure &&
        this.props.FMEA.StructurePane.structureTreeRoot.id ==
          this.props.FMEA.selectedStructure.id
      ) {
        rootStructureSetAble = true
        rootStructureChecked = true
      } else {
        rootStructureSetAble = false
        rootStructureChecked = false
      }
    }
    return (
      <div className={styles.treePage}>
        {FMEA.selectedStructure && (
          <div className={styles.setTarget}>
            <div className={styles.currStr}>当前结构:</div>
            <div className={styles.currN}>
              <Icon type="appstore" theme="filled" />
              <span>{this.props.FMEA.selectedStructure.name}</span>
              {/* <Button type="dashed" onClick={e => this.setRoot(e)}> */}
              <div>
                <Checkbox
                  checked={rootStructureChecked}
                  disabled={!rootStructureSetAble}
                  onChange={e => this.rootChange(e)}
                >
                  {'设为根节点'}
                </Checkbox>
              </div>
            </div>
          </div>
        )}
        {FMEA.selectedStructure &&
          FMEA.selectedStructure.FunctionSet.length > 0 && (
            <div className={styles.setTarget}>
              <div className={styles.currTree}>
                <span>功能树:</span>
              </div>
              <Tree
                showLine
                defaultExpandAll={true}
                showLine
                onSelect={this.onSelect}
              >
                {funList}
              </Tree>
            </div>
          )}
        {FMEA.actionType == 2 && <FailDeatail {...this.props} />}
        <div className={styles.btnDiv}>
          {(FMEA.actionType == 1 || FMEA.actionType == 0) && (
            <Button className={styles.addBtn} onClick={e => this.addFun(e)}>
              添加功能
            </Button>
          )}
          {FMEA.actionType == 1 &&
            FMEA.selectedStructure.FunctionSet.length > 0 && (
              <Button
                className={styles.addBtn}
                onClick={e => this.props.dispatch({ type: 'FMEA/removeFun' })}
              >
                删除功能
              </Button>
            )}
          {FMEA.actionType == 1 && (
            <Button
              className={styles.addBtnDepend}
              onClick={e => this.addFunDepend(e)}
            >
              添加功能依赖
            </Button>
          )}
          {FMEA.actionType == 1 && (
            <Button
              className={styles.addFaillBtn}
              onClick={e => this.addFail(e)}
            >
              添加失效
            </Button>
          )}
          {FMEA.actionType == 2 && (
            <Button
              className={styles.addBtn}
              onClick={e => this.addFailDepend(e)}
            >
              添加失效依赖
            </Button>
          )}
          {FMEA.actionType == 2 && (
            <Button
              className={styles.addBtn}
              onClick={e => this.props.dispatch({ type: 'FMEA/removeFail' })}
            >
              删除失效
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default TreePage
