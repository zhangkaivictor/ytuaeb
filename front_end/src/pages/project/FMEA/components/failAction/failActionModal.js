import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Form, Input, Modal, Select, Icon, Button} from 'antd'
import {
  dicNameQuery
} from 'utils'
import { Trans, withI18n } from '@lingui/react'
import FailAction from './failAction'
let id = 0;
const Option = Select.Option

const FormItem = Form.Item

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
    // We need at least one precaution
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
    console.log(keys,id)
    const nextKeys = keys.concat({ key: '1', value: '', id: id++ });
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.keys.length == 0) {
        return
      }
      if (!err) {
        const { keys, names } = values;
        console.log('Merged values:', names.forEach((value, index) => { value.id = index }));
        // let props=keys.map(key => names[key])
        // console.log(props)
        this.props.dispatch({ type: 'FMEA/editFailProps', payload: names })
      }
    });
  };
  handleCancel = e => {
    this.props.dispatch({ type: 'FMEA/showFailAction', payload: { show: false } })
  }
  onChange = e => {
    console.log(e)
  }

  componentDidMount() {
    //获取依赖功能选项列表
    //获取依赖失效功能列表
    console.log(this.props)
  }
  handleKeyChange = (key,index) => {
    
    console.log(key)

  };
  remoteChild=[]
  handleValueChange = (key,index) => {
    let propsKey=1
    this.props.form.validateFields((err, values) => {
        const { keys, names } = values;
        console.log('Merged values:', names[index].key);
        propsKey=names[index].key
    });
    console.log(key,index)
    let {
      selectedStructure,
      selectedFun,
      selectedFail}=this.props.FMEA
    let keyWordsStr=`${selectedStructure.name}^${selectedFun.name}^${selectedFail.name}^${dicNameQuery('failureProperties',propsKey)}^${key}`
    console.log(keyWordsStr)
    this.props.dispatch({type:'FMEA/GetPrecautionOption',payload:keyWordsStr})
    // let array={[]}
          {/* <Option key={dictionary[i].id} value={dictionary[i].dictValue}>{dictionary[i].dictName}</Option> */}
          {/* <Option key={dictionary[i].id} value={dictionary[i].dictValue}>{dictionary[i].dictName}</Option> */}
  };

  render() {
    // console.log(this.props.FMEA.selectedStructure.allAboveNodes())
    // let
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 0 },
      },
    };
    let children = []
    const getChild = () => {
      let dictionary = dicNameQuery('failureProperties')
      for (let i = 0; i < dictionary.length; i++) {
        children.push(
          <Option key={dictionary[i].id} value={dictionary[i].dictValue}>{dictionary[i].dictName}</Option>
        )
      }
    }
    getChild()
    let precautionOptions=[]
    const getRemotePrecaution=()=>{
      console.log(this.props)
      const {remotePrecautions}=this.props.FMEA
      console.log(remotePrecautions)
      if(remotePrecautions){
        precautionOptions=remotePrecautions.map(precaution=>{
          return <Option key={precaution} value={precaution}>{precaution}</Option>
        })
      }
      
    }
    getRemotePrecaution()
    getFieldDecorator('keys', { initialValue: this.props.FMEA.selectedFail ? this.props.FMEA.selectedFail.properties : [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Row key={index} gutter={16}>
        {/* <Col span={13} >
          <Form.Item style={{marginBottom:0}}>
            {getFieldDecorator(`names[${index}].value`, {
              initialValue: k.value,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input precaution's name or delete this field.",
                },
              ],
            })(<Input placeholder="precaution name" style={{ marginRight: 10 }} onChange={e=>this.handleValueChange(e,index)} />)}
          </Form.Item></Col> */}
        <Col span={13} >
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator(`names[${index}].value`, {
              initialValue: k.value,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
              ],
            })(<Select
              mode='combobox'
              tabIndex={0}
              showSearch
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onChange={e=>this.handleValueChange(e,index)}
              onBlur={e=>this.handleValueChange(e,index)}
              notFoundContent={null}
            >
            {precautionOptions}
            </Select>)}
          </Form.Item></Col>
        <Col span={7}>
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator(`names[${index}].key`, {
              initialValue: k.key,
              validateTrigger: [],
              rules: [
                {/* {
              required: true,
              whitespace: true,
              message: "Please input precaution's name or delete this field.",
            }, */}
              ],
            })(<Select
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={e => this.handleKeyChange(e)}
            >
              {children}
            </Select>)}
          </Form.Item></Col>
        <Col span={4}>{keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
            style={{ lineHeight: '40px' }}
          />
        ) : null}</Col>
      </Row>


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
  type: PropTypes.string,
  state: PropTypes.object,
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
}

export default failActionModal
