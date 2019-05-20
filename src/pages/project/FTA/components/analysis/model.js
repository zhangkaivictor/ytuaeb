import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'

const FormItem = Form.Item

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
  render() {
    const { item = {}, onOk, form, i18n, userData, userNameList, ...modalProps } = this.props
    const { getFieldDecorator } = form
    const owner= window.localStorage.getItem('username');
    if (modalProps.title == '创建用户') {
      userList = <Form layout="horizontal">
        <FormItem label={'项目名称'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '项目名不能为空',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label={'所有者'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('owner', {
            initialValue: owner,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={'创建时间'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('varData', {
            initialValue: new Date().toLocaleString( ),
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={i18n.t`Note`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input/>)}
        </FormItem>
        <FormItem label={'标签'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('tag', {
            initialValue: item.tag,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input/>)}
        </FormItem>
        <FormItem label={'项目参与者'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('usersPrivileges', {
            initialValue: item.usersPrivileges,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input/>)}
          {/*<usersPrivileges {...addRemoveProps}/>*/}
        </FormItem>
      </Form>
    } else if (modalProps.title == '更新用户') {
      userList = <Form layout="horizontal">
        <FormItem label={'ID'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('ID', {
            initialValue: item.id,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={'项目名称'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: i18n.t`The input is not valid E-mail!`,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={'所有者'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('realName', {
            initialValue: item.createdBy.realName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={'创建时间'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('createdTime', {
            initialValue: item.createdTime,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label={'标签'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('tag', {
            initialValue: item.tag,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input/>)}
        </FormItem>
        <FormItem label={i18n.t`Note`} hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input/>)}
        </FormItem>
        <FormItem label={'项目参与者'} hasFeedback {...formItemLayout}>
          {getFieldDecorator('usersPrivileges', {
            initialValue: item.usersPrivileges,
            rules: [
              {
                required: false,
              },
            ],
          })(<input/>)}
        </FormItem>
      </Form>
    }
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        { userList }
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  state: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func
}

export default UserModal
