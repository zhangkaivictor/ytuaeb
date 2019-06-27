import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import PartnerLists from './PartnerLists'

const FormItem = Form.Item

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const usersListFn = (all, currentlyUser, createdReal) => {
  let data = []
  for (let i = 0; i <= all.length - 1; i++) {
    let dataList = {}
    dataList.realName = all[i].realName
    dataList.emailAddress = all[i].emailAddress
    if (
      !all[i].roles.includes('Administrator') &&
      all[i].emailAddress != currentlyUser &&
      all[i].status == 1 &&
      all[i].realName != createdReal
    ) {
      data.push(dataList)
    }
  }
  return data
}
const selectedOptionsListFn = all => {
  let data = []
  if (all.length > 0) {
    for (let i = 0; i <= all.length - 1; i++) {
      if (all[i].privilege == '2') {
        data.push(all[i])
      }
    }
  }
  return data
}
const readOptionsListFn = all => {
  let data = []
  if (all.length > 0) {
    for (let i = 0; i <= all.length - 1; i++) {
      if (all[i].privilege == '1') {
        data.push(all[i])
      }
    }
  }
  return data
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const arrDup = (bigArr, arr1, arr2) => {
  let arrNameList = []
  let newBigArr = []
  arr1.forEach(item => {
    arrNameList.push(item.realName)
  })
  arr2.forEach(item => {
    arrNameList.push(item.realName)
  })
  bigArr.forEach(item => {
    if (arrNameList.indexOf(item.realName) < 0) {
      newBigArr.push(item)
    }
  })
  return newBigArr
}
const { Option } = Select
const children = []
for (let i = 0; i < 10; i++) {
  let v = Math.pow(2, i)
  children.push(<Option key={v}>{`Level${i}`}</Option>)
}

function handleChange(value) {}
@withI18n()
@Form.create()
class UserModal extends PureComponent {
  constructor(props) {
    super(props)
  }
  handleOk = () => {
    const { item = {}, onOk, userNameList, form } = this.props
    const { validateFields, getFieldsValue } = form
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }

      if (this.props.title == '创建项目') {
        if (this.props.start == '1') {
          data.type = 'WorkProject'
        } else if (this.props.start == '2') {
          data.type = 'FMEAProject'
        } else {
          data.type = 'FTAProject'
        }
        data.id = guid()
      } else {
        if (this.props.start == '1') {
          data.type = 'WorkProject'
        } else if (this.props.start == '2') {
          data.type = 'FMEAProject'
        } else {
          data.type = 'FTAProject'
        }
      }
      let newCreateRead = data.usersPrivileges.readOptions
      let newCreateWrite = data.usersPrivileges.selectedOptions
      data.usersPrivileges = newCreateRead.concat(newCreateWrite)
      onOk(data)
    })
  }

  render() {
    const {
      item = {},
      onOk,
      form,
      i18n,
      userData,
      userNameList,
      ...modalProps
    } = this.props
    const { getFieldDecorator } = form
    const owner = window.localStorage.getItem('username')
    let userList
    let usersPrivileges = item.usersPrivileges
    if (modalProps.title == '创建项目') {
      const addRemoveProps = {
        options: usersListFn(userNameList, owner),
        selectedOptions: [],
        readOptions: [],
      }
      userList = (
        <Form layout="horizontal">
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
            })(<Input disabled />)}
          </FormItem>
          {this.props.start == 1 && (
            <Form.Item label="Level" {...formItemLayout}>
              {getFieldDecorator('level', {
                rules: [
                  { required: true, message: 'Please select project level!' },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  onChange={handleChange}
                >
                  {children}
                </Select>
              )}
            </Form.Item>
          )}
          <FormItem label={'创建时间'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('varData', {
              initialValue: new Date().toLocaleString(),
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={'标签'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('tag', {
              initialValue: item.tag,
              rules: [
                {
                  required: false,
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
          <FormItem label={'项目参与者'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('usersPrivileges', {
              initialValue: addRemoveProps,
            })(<PartnerLists {...addRemoveProps} />)}
          </FormItem>
        </Form>
      )
    } else if (modalProps.title == '更新项目') {
      let createdReal = item.createdBy.realName
      const addRemoveProps = {
        options: arrDup(
          usersListFn(userNameList, owner, createdReal),
          selectedOptionsListFn(usersPrivileges),
          readOptionsListFn(usersPrivileges)
        ),
        selectedOptions: selectedOptionsListFn(usersPrivileges),
        readOptions: readOptionsListFn(usersPrivileges),
      }
      let lastModified = item.lastModifiedBy.realName
      userList = (
        <Form layout="horizontal">
          <FormItem label={'ID'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('ID', {
              initialValue: item.id,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
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
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={'所有者'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('realName', {
              initialValue: item.createdBy.realName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={'创建时间'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('createdTime', {
              initialValue: item.createdTime,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label={'修改者'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('lastModified', {
              initialValue: lastModified,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>

          <FormItem label={'标签'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('tag', {
              initialValue: item.tag,
              rules: [
                {
                  required: false,
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
          <FormItem label={'项目参与者'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('usersPrivileges', {
              initialValue: addRemoveProps,
            })(<PartnerLists {...addRemoveProps} />)}
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
  state: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  confirmUserPrivileges: PropTypes.func,
}

export default UserModal
