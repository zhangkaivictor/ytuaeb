import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'

const FormItem = Form.Item
const Option = Select.Option

const handleChange = value => {
  console.log(`selected ${value}`)
}

const changeStatus = value => {
  if (value == '正常') {
    return 1
  } else {
    return 2
  }
}

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
class UserModal extends PureComponent {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }

      if (this.props.title == '创建用户') {
        data.status = changeStatus(data.status)
        data.status = parseInt(data.status)
        data.roles = ['user']
        console.log(data.status)
        onOk(data)
      } else {
        data.status = parseInt(data.status)
        onOk(data)
      }
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form
    let userList
    if (modalProps.title == '创建用户') {
      userList = (
        <Form layout="horizontal">
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('emailAddress', {
              initialValue: item.emailAddress,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`The input is not valid E-mail!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('realName', {
              initialValue: item.realName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Password`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: item.password,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input type={'password'} />)}
          </FormItem>
          <FormItem label={i18n.t`Status`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status == undefined ? '正常' : '冻结',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select onChange={handleChange} defaultValue="正常">
                <Option value="1">正常</Option>
                <Option value="2">冻结</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label={i18n.t`Phone`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('phoneNumber', {
              initialValue: item.phoneNumber,
              rules: [
                {
                  required: false,
                  pattern: /^1[34578]\d{9}$/,
                  message: i18n.t`The input is not valid phone!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Note`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      )
    } else if (modalProps.title == '修改密码') {
      userList = (
        <Form layout="horizontal">
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('emailAddress', {
              initialValue: item.emailAddress,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`The input is not valid E-mail!`,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={i18n.t`Password`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('newPassword', {
              initialValue: item.password,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input type={'password'} />)}
          </FormItem>
        </Form>
      )
    } else {
      userList = (
        <Form layout="horizontal">
          <FormItem label={i18n.t`Email`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('emailAddress', {
              initialValue: item.emailAddress,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`The input is not valid E-mail!`,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={i18n.t`Name`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('realName', {
              initialValue: item.realName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Status`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status == '1' ? '1' : '2',
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select
                onChange={handleChange}
                defaultValue={item.status == '1' ? '正常' : '冻结'}
              >
                <Option value="1">正常</Option>
                <Option value="2">冻结</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label={i18n.t`Phone`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('phoneNumber', {
              initialValue: item.phoneNumber,
              rules: [
                {
                  required: false,
                  pattern: /^1[34578]\d{9}$/,
                  message: i18n.t`The input is not valid phone!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Note`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      )
    }
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        {userList}
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
