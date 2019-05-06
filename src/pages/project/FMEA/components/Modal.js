import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'

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
class addModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      itemOptions: [],
      defaultItemOption: '',
    }
  }
  handleOk = () => {
    const { onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  handleChange(e) {
    console.log(e)
  }
  getAllAboveNodeOption = () => {
    let array = []
    if (this.props.FMEA.createModalType == 3) {
      this.props.FMEA.selectedStructure.allAboveNodes().map(element => {
        console.log(array.push(...element.FunctionSet))
      })
      console.log(array)
      if (array.length > 0) {
        this.setState({
          itemOptions: array,
          defaultItemOption: array[0].id,
        })
      }
    } else if (this.props.FMEA.createModalType == 2) {
      this.props.FMEA.selectedStructure.allAboveNodes().map(element => {
        // console.log(array.push(...element.FunctionSet))
        element.FunctionSet.forEach(fun => {
          fun.FailureSet.forEach(fail => array.push(fail))
        })
      })
      console.log(array)
      if (array.length > 0) {
        this.setState({
          itemOptions: array,
          defaultItemOption: array[0].id,
        })
      }
    }
  }

  componentDidMount() {
    //获取依赖功能选项列表
    this.getAllAboveNodeOption()
    console.log(this.state)
    //获取依赖失效功能列表
  }
  render() {
    // console.log(this.props.FMEA.selectedStructure.allAboveNodes())
    // let
    const { FMEA } = this.props
    const { item = {}, onOk, form, ...modalProps } = this.props
    const { getFieldDecorator } = form
    let addItem
    if (modalProps.type == 0) {
      addItem = (
        <Form layout="horizontal">
          <FormItem label={'功能'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: '功能不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      )
    } else if (modalProps.type == 1) {
      addItem = (
        <Form layout="horizontal">
          <FormItem label={'失效'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  message: '失效不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      )
    } else if (modalProps.type == 3) {
      addItem = (
        <Form layout="horizontal">
          <Form.Item label="功能依赖" hasFeedback {...formItemLayout}>
            {getFieldDecorator('id', {
              initialValue: this.state.defaultItemOption,
              rules: [
                {
                  required: true,
                  message: '功能依赖不能为空',
                },
              ],
            })(
              <Select onChange={this.handleChange}>
                {this.state.itemOptions.length > 0 &&
                  this.state.itemOptions.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </Form.Item>
        </Form>
      )
    } else {
      addItem = (
        <Form layout="horizontal">
          <Form.Item label="失效依赖" hasFeedback {...formItemLayout}>
            {getFieldDecorator('id', {
              initialValue: this.state.defaultItemOption,
              rules: [
                {
                  required: true,
                  message: '失效依赖不能为空',
                },
              ],
            })(
              <Select onChange={this.handleChange}>
                {this.state.itemOptions.length > 0 &&
                  this.state.itemOptions.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </Form.Item>
        </Form>
      )
    }

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        {addItem}
      </Modal>
    )
  }
}

addModal.propTypes = {
  type: PropTypes.number,
  state: PropTypes.object,
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
}

export default addModal
