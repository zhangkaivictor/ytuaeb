import React, { PureComponent } from 'react'
import { Transfer, Switch, Modal } from 'antd';
import PropTypes from 'prop-types'

class DependModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      targetKeys: [],
      selectedKeys: [],
      disabled: true,
      itemOptions: [],
      title:'依赖编辑'
    }
  }
  getAllAboveNodeOption = () => {
    let array = []
    if (this.props.FMEA.createModalType == 3) {
      this.props.FMEA.selectedStructure.allAboveNodes().map(element => {
        //去重复
        if (
          !array.find(el => el.id == element.FunctionSet.id) &&
          this.props.FMEA.selectedStructure.id !== element.FunctionSet.id
        ) {
          array.push(...element.FunctionSet)
        }
      })
      //添加key
      array.forEach(fun=>fun.key=fun.id)     
      if (array.length > 0) {
        this.setState({
          itemOptions: array
        })
      }
    } else if (this.props.FMEA.createModalType == 2) {
      this.props.FMEA.selectedStructure.allAboveNodes().map(element => {
        // console.log(array.push(...element.FunctionSet))
        element.FunctionSet.forEach(fun => {
          fun.FailureSet.forEach(fail => array.push(Object.assign(fail, { key: fail.id })))
        })
      })
      console.log(array)
      if (array.length > 0) {
        this.setState({
          itemOptions: array,
        })
      }
    }
  }
  getSelectedOPtion = () => {
    let array = []
    let title=''
    if (this.props.FMEA.createModalType == 3) {
      array.push(...this.props.FMEA.selectedFun.dependentFunctionSet)
      title=this.props.FMEA.selectedFun.name
    } else if (this.props.FMEA.createModalType == 2) {
      array.push(...this.props.FMEA.selectedFail.dependentFailureSet)
      title=this.props.FMEA.selectedFail.name
    }
    array.forEach(fun=>fun.key=fun.id)     
      if (array.length > 0) {
        this.setState({
          targetKeys: array.map(f=>f.id),
          title:'编辑依赖-'+title
        })
      }
  }
  componentWillMount() {
    //获取依赖功能选项列表
    this.getAllAboveNodeOption()
    //获取依赖失效功能列表
    this.getSelectedOPtion()
  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  handleDisable = disabled => {
    this.setState({ disabled });
  };
  handleCancel = e => {
    this.props.dispatch({ type: 'FMEA/showFailDepend', payload: { show: false } })
  };
  handleOk = e => {
//
    console.log(this.state.targetKeys)
    if (this.props.FMEA.createModalType == 3) {
      this.props.dispatch({ type: 'FMEA/editFunctionDependent', payload: { data: this.state.targetKeys } })
    } else if (this.props.FMEA.createModalType == 2) {
      this.props.dispatch({ type: 'FMEA/editFailDependent', payload: { data: this.state.targetKeys } })
    }
    
  }
  renderItem = item => {
    const customLabel = (
      <span className="custom-item">
        {item.name}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.id, // for title and filter matching,
      key: item.id
    };
  };
  render() {
    const { targetKeys, selectedKeys, disabled, itemOptions } = this.state;
    return (
      <Modal onOk={this.handleOk} onCancel={this.handleCancel} visible={this.props.FMEA.DependModalVisiable} title={this.state.title}>
        <div>
          <Transfer
            dataSource={itemOptions}
            titles={['可选依赖', '已选依赖']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            onScroll={this.handleScroll}
            render={this.renderItem}
            disabled={disabled}
          />
          <Switch
            unCheckedChildren="disabled"
            checkedChildren="disabled"
            checked={disabled}
            onChange={this.handleDisable}
            style={{ marginTop: 16 }}
          />
        </div>
      </Modal>
    )
  }
}

DependModal.propTypes = {
  type: PropTypes.string,
  state: PropTypes.object,
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
}

export default DependModal
