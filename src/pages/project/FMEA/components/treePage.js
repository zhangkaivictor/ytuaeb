import React, { Component } from 'react'
import { Tree, Icon, Button } from 'antd'
import styles from './treePage.less'
const { TreeNode } = Tree

class TreePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { nodeType: 0 }
  }
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
    console.log('selected', this.props.FMEA.selectedStructure)
    this.props.dispatch({
      type: 'FMEA/selectKey',
      payload: { id: info.node.props.eventKey },
    })
    // let isLeaf=true;
    // for(let i=0;i<this.props.FMEA.selectedStructure.FunctionSet.length;i++){
    //   if(this.props.FMEA.selectedStructure.FunctionSet[i].id==info.node.props.eventKey){
    //     this.props.dispatch({ type: 'FMEA/selectFun', payload: { id:  info.node.props.eventKey} })
    //     return
    //   }
    // }
    // for(let i=0;i<this.props.FMEA.selectedStructure.FunctionSet.length;i++){
    //   this.props.FMEA.selectedStructure.FunctionSet[i].FailureSet.forEach(fail=>{

    //   })
    // }
    // this.setState({
    //   nodeType:isLeaf?1:0
    // });
    // if(isLeaf){
    //   this.props.dispatch({ type: 'FMEA/selectFail', payload: { id:  info.node.props.eventKey} })
    // }else{
    //   this.props.dispatch({ type: 'FMEA/selectFun', payload: { id:  info.node.props.eventKey} })
    // }
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
    console.log(e, this.props.FMEA.selectedFun)
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 1 } })
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
    console.log(e)
    if (!this.props.FMEA.selectedFail) {
      alert('请选择失效')
      return
    }
    this.props.dispatch({ type: 'FMEA/triggerType', payload: { type: 2 } })
  }
  //显示按钮
  getBtnDisplay() {
    console.log(this.props)
    return this.state.FMEA.actionType
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
          return <TreeNode title={leaf.name} key={leaf.id} />
        })
      }
      console.log(lh)
      return lh
    }
    if (
      FMEA.selectedStructure &&
      FMEA.selectedStructure.FunctionSet.length > 0
    ) {
      funList = FMEA.selectedStructure.FunctionSet.map(fun => {
        return (
          <TreeNode title={fun.name} key={fun.id}>
            {getLeafHtml(fun.FailureSet)}
            {/* {[]} */}
          </TreeNode>
        )
      })
    }
    return (
      <div className={styles.treePage}>
        {FMEA.selectedStructure && (
          <div>
            <div className={styles.currStr}>当前结构:</div>
            <div className={styles.currN}>
              <Icon type="appstore" theme="filled" />
              <span>{this.props.FMEA.selectedStructure.name}</span>
              <Button type="dashed" onClick={e => this.setRoot(e)}>
                <Icon type="plus" /> 设置根节点
              </Button>
            </div>
          </div>
        )}
        {FMEA.selectedStructure &&
          FMEA.selectedStructure.FunctionSet.length > 0 && (
            <div>
              <div className={styles.currTree}>
                <span>功能树:</span>
                <Button type="dashed" onClick={e => this.addFun(e)}>
                  <Icon type="plus" /> 添加功能
                </Button>
                {/* <div> */}
                {/* <Icon type="folder-add"  theme="twoTone" onClick={(e) => this.addFun(e)}/> */}
                {/* <span>添加功能</span> */}
                {/* </div> */}
              </div>
              <Tree showLine defaultExpandAll onSelect={this.onSelect}>
                {funList}
              </Tree>
            </div>
          )}
        {FMEA.actionType == 0 && (
          <Button className={styles.addBtn} onClick={e => this.addFun(e)}>
            添加功能
          </Button>
        )}
        {FMEA.actionType == 1 && (
          <Button className={styles.addBtn} onClick={e => this.addFunDepend(e)}>
            添加功能依赖
          </Button>
        )}
        {FMEA.actionType == 1 && (
          <Button className={styles.addFaillBtn} onClick={e => this.addFail(e)}>
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
      </div>
    )
  }
}

export default TreePage
