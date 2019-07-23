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
    const value = props.value || {};
    this.state = {
      number: value.text || '',
      currency: value.type || 1,
    };
  }

  handleNumberChange = e => {
    let text=e.target.value.trim()
    if (text.trim()=='') {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ text });
    }
    this.triggerChange({ text });
  };

  handleCurrencyChange = type => {
    if (!('value' in this.props)) {
      this.setState({ type });
    }
    this.triggerChange({ type });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const { state } = this;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.number}
          onChange={this.handleNumberChange}
          style={{ width: '55%', marginRight: '3%' }}
        />
        <Select
          value={state.currency}
          size={size}
          style={{ width: '32%' ,marginRight: '3%'}}
          onChange={this.handleCurrencyChange}
        >
          <Option value={1}>预防措施</Option>
          <Option value={2}>探测措施</Option>
          <Option value={3}>改进预防措施</Option>
          <Option value={4}>改进探测措施</Option>
        </Select>
      </span>
    );
  }
}
export default FailAction
