import { Form, Input, Select, Button } from 'antd';
import React, { PureComponent } from 'react'

const { Option } = Select;

class FailAction extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    console.log(props)
    const value = props.value || {};
    console.log(value)
    this.state = {
      key: value.key || "1",
    };
  }

  handleValueChange = e => {
    let text=e.target.value.trim()
    if (text.trim()=='') {
      return;
    }
    console.log(text,this.props)
    if (!('value' in this.props)) {
      this.setState({ value:text });
    }
    this.triggerChange({ value:text });
  };

  handlekeyChange = key => {
    console.log(key)
    if (!('value' in this.props)) {
      this.setState({ key });
    }
    this.triggerChange({ key });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    console.log(changedValue)
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const { state } = this;
    const children = []
    let dic=JSON.parse(localStorage.getItem('dictionary'))
    ? JSON.parse(localStorage.getItem('dictionary'))
    : []
    let dictionary = dic.filter(dic=>dic.groupName=== "failureProperties")
    for (let i = 0; i < dictionary.length; i++) {
      children.push(
        <Option key={dictionary[i].id} value={dictionary[i].dictValue}>{dictionary[i].dictName}</Option>
      )
    }
    return (
      <span>
        {/* <Input
          key="text"
          size={size}
          value={state.value}
          onChange={this.handleValueChange}
          style={{ width: '55%', marginRight: '3%' }}
        /> */}
        <Select
          value={state.key}
          size={size}
          style={{marginRight: '3%'}}
          onChange={this.handlekeyChange}
        >
        {children}
        </Select>
      </span>
    );
  }
}
export default FailAction
