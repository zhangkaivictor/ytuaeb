import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Modal, Select, Icon, Button } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import FailAction from './failAction'
let id = 0;
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

@withI18n()
@Form.create()
class failActionModal extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
  }
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
    this.props.dispatch({type:'FMEA/showFailAction',payload:{show:false}})
  };
  handleCancel=e=>{
    this.props.dispatch({type:'FMEA/showFailAction',payload:{show:false}})
  }
  componentDidMount() {
    //获取依赖功能选项列表
    //获取依赖失效功能列表
  }
  render() {
    // console.log(this.props.FMEA.selectedStructure.allAboveNodes())
    // let
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 0 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        required={false}
        key={k}
        style={{marginBottom:0}}
      >
        {getFieldDecorator(`names[${k}]`, {
          initialValue: { type: 1, ctext: '' },
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<FailAction placeholder="passenger name" style={{ width: '60%', marginRight: 10 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Modal onOk={this.handleOk} onCancel={this.handleCancel} visible={this.props.FMEA.failActionModalVisiable}>
        <Form>
          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '55%' }}>
              <Icon type="plus" /> Add field
          </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

failActionModal.propTypes = {
  type: PropTypes.number,
  state: PropTypes.object,
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
}

export default failActionModal
