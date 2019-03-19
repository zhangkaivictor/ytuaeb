import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import AddRemoveSelection from './AddRemoveSelection'

const FormItem = Form.Item
const Option = Select.Option

// const onchangeItem = (item) >= {
//   dispatch({
//     type: 'post/showModal',
//     payload: {
//       modalType: 'change',
//       currentItem: item,
//     },
//   })
// }

const options = [
  {id: 1, name: 'admin@dxc.com'},
  {id: 2, name: 'testuser01@saicmotor.com'}
]

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
    const { item = {}, onOk, form} = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      if(this.props.title == "创建用户"){
        if (this.props.start == "1"){
          data.Type = 'WorkProject'
        }else if(this.props.start == "2"){
          data.Type = 'FMEAProject'
        }else {
          data.Type = 'FTAProject'
        }
        data.Id = guid();
      }else {
        if (this.props.start == "1"){
          data.Type = 'WorkProject'
        }else if(this.props.start == "2"){
          data.Type = 'FMEAProject'
        }else {
          data.Type = 'FTAProject'
        }
      }
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, userData, ...modalProps } = this.props
    console.log(userData);
    const { getFieldDecorator } = form
    const owner= window.localStorage.getItem('username');
    let userList;
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
          })( < AddRemoveSelection options={options}
                                   onChange={this.handleChange}/>)}
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
          })(< AddRemoveSelection options={options}/>)}
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
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
  handleSelect: PropTypes.func,
}

export default UserModal
