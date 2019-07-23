import React, { Component } from 'react'
import { Tree, Icon, Button, Checkbox, Input, Form } from 'antd'
import {
  dicNameQuery
} from 'utils'
import FailDeatail from './failDetail'
import styles from './treePage.less'
const { TreeNode } = Tree
const FormItem = Form.Item
@Form.create()
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
    //失效措施
    if (info.node.props.style.color == 'blue') {
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
  //设置根结构
  rootChange(e) {
    if (e.target.checked) {
      this.props.dispatch({ type: 'FMEA/setRootNode' })
    } else {
      this.props.dispatch({ type: 'FMEA/cancelRootNode' })
    }
  }
  //
  failActionShow(e) {
    this.props.dispatch({ type: 'FMEA/showFailAction', payload: { show: true } })
  }
  render() {
    const { FMEA } = this.props
    const { item = {}, onOk, form, ...modalProps } = this.props
    const { getFieldDecorator, resetFields } = form
    const getProptiesV=(pre)=>{
      return pre.valueList.map(v=>{
        return <TreeNode title={v.value} key={v.id} style={{ color: 'blue' }}/>
      })
    }
    const getProperties = (leaf) => {
      let precautions = dicNameQuery('failureProperties')
      precautions.forEach(pre => {
        pre.valueList = []
        leaf.properties.forEach(prop => {
          if (prop.key == pre.dictValue) {
            pre.valueList.push(prop)
          }
        })
      })
      console.log(precautions)
      let properties = precautions.map(pre => {
        return <TreeNode
          title={`${pre.dictName}`}
          key={pre.dictValue}
          className={styles.funNode}
          style={{ color: 'blue' }}>
          {getProptiesV(pre)}
          </TreeNode>
      })
      return properties
    }
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
            >
              {/* {(leaf.properties.length > 0) && (leaf.properties.map(proper => {
                return <TreeNode
                  title={`${dicNameQuery('failureProperties',proper.key)} : ${proper.value}`}
                  key={proper.id}
                  className={styles.funNode}
                  style={{ color: 'blue' }}
                />
              }))} */}
              {(leaf.properties.length > 0) && (getProperties(leaf))}
            </TreeNode>
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
    //
    const handleInputChange = e => {
      if (e.target.value && e.target.value.trim() !== '') {
        this.props.dispatch({
          type: 'FMEA/updateLabel',
          payload: { value: e.target.value },
        })
      }
      //重置表单
      resetFields()
    }
    const getInitialValue = () => {
      return this.props.FMEA.selectedStructure
        ? this.props.FMEA.selectedStructure.name
        : ''
    }
    let initValue = getInitialValue()
    return (
      <div className={styles.treePage}>
        {FMEA.selectedStructure && (
          <div className={styles.setTarget}>
            <div className={styles.currStr}>当前结构:</div>
            <div className={styles.currN}>
              <Icon type="appstore" theme="filled" />
              {/* <span>{this.props.FMEA.selectedStructure.name}</span> */}
              <Form
                style={{ display: 'inline-block', width: 'calc(100% - 150px)' }}
              >
                <FormItem>
                  {getFieldDecorator('label', { initialValue: initValue })(
                    <Input onBlur={e => handleInputChange(e)} />
                  )}
                </FormItem>
              </Form>

              {/* <Input
                value={initValue}
                onBlur={e => this.handleInputChange(e)}
                style={{ width: 'calc(100% - 150px)' }}
              /> */}
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

        <div className={styles.setTarget}>
          <div className={styles.currTree}>
            <span>功能树:</span>
            <Button type="dashed" onClick={e => this.addFun(e)}>
              <Icon type="plus" /> 添加功能
                </Button>
          </div>
          {FMEA.selectedStructure &&
            FMEA.selectedStructure.FunctionSet.length > 0 && (<Tree
              showLine
              defaultExpandAll={true}
              showLine
              onSelect={this.onSelect}
            >
              {funList}
            </Tree>)}
        </div>

        {FMEA.actionType == 2 && <FailDeatail {...this.props} />}
        <div className={styles.btnDiv}>
          {/* {(FMEA.actionType == 0) && (
          <Button className={styles.addBtn} onClick={e => this.addFun(e)} size='small'>
            添加功能
            </Button>
          )} */}
          {FMEA.actionType == 1 &&
            FMEA.selectedStructure.FunctionSet.length > 0 && (
              <Button
                className={styles.addBtn}
                size='small'
                onClick={e => this.props.dispatch({ type: 'FMEA/removeFun' })}
              >
                删除功能
              </Button>
            )}
          {FMEA.actionType == 1 && (
            <Button
              className={styles.addBtnDepend}
              size='small'
              onClick={e => this.addFunDepend(e)}
            >
              添加功能依赖
            </Button>
          )}
          {FMEA.actionType == 1 && (
            <Button
              className={styles.addFaillBtn}
              size='small'
              onClick={e => this.addFail(e)}
            >
              添加失效
            </Button>
          )}
          {FMEA.actionType == 2 && (
            <Button
              className={styles.addBtn}
              size='small'
              onClick={e => this.addFailDepend(e)}
            >
              添加失效依赖
            </Button>
          )}
          {FMEA.actionType == 2 && (
            <Button
              className={styles.addBtn}
              size='small'
              onClick={e => this.props.dispatch({ type: 'FMEA/removeFail' })}
            >
              删除失效
            </Button>
          )}
          {FMEA.actionType == 2 && (
            <Button
              className={styles.addBtn}
              size='small'
              onClick={e => this.failActionShow(e)}
            >
              措施
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default TreePage
