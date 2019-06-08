import React, { Component } from 'react'
import { Tree, Icon, Button, Checkbox } from 'antd'
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
    console.log('selected', this.props.FMEA.StructurePane.structureTreeRoot)
    if (!this.props.FMEA.StructurePane.structureTreeRoot) {
      alert('请设置根节点')
      return
    }
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
  //移除失效
  removeFail(e) {
    console.log(this.props.FMEA.selectedFun)
    console.log(this.props.FMEA.selectedFail)
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
    return this.prpos.FMEA.actionType
  }
  //设置根结构
  rootChange(e) {
    console.log(e)
    console.log(this.props)
    console.log(this.props.FMEA.selectedStructure)
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
      console.log(lh)
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

    // if(this.props.FMEA.selectedStructure&&(this.props.FMEA.selectedStructure.id==this.props.FMEA.StructurePane.structureTreeRoot.id)){
    //   rootStructureSetAble=true
    // }
    return (
      <div className={styles.treePage}>
        {FMEA.selectedStructure && (
          <div>
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
              {/* <Button
                type="danger"
                className={styles.rootBtn}
                onClick={e => this.setRoot(e)}
              >
                
              </Button> */}
            </div>
          </div>
        )}
        {FMEA.selectedStructure &&
          FMEA.selectedStructure.FunctionSet.length > 0 && (
            <div>
              <div className={styles.currTree}>
                <span>功能树:</span>
                {/* <Button type="dashed" onClick={e => this.addFun(e)}>
                  <Icon type="plus" /> 添加功能
                </Button> */}
                {/* <div> */}
                {/* <Icon type="folder-add"  theme="twoTone" onClick={(e) => this.addFun(e)}/> */}
                {/* <span>添加功能</span> */}
                {/* </div> */}
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
