import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, List, Select, Popconfirm } from 'antd'
import style from './PartnerList.less'

const delPartner = (arr, findArr) => {
  let flag = false
  arr.forEach(item => {
    if (item.realName == findArr.realName) {
      flag = true
    }
  })
  return flag
}
const findPrivileges = arr => {
  let flag = false
  arr.forEach(item => {
    if (item.emailAddress == localStorage.getItem('username')) {
      flag = true
    }
  })
  return flag
}
class PartnerLists extends React.Component {
  handleSelect = (start, optionName) => {
    let { options, selectedOptions, readOptions } = this.props
    console.log(this.props)
    if (start == 1) {
      let isSide = delPartner(selectedOptions, optionName)
      if (!isSide) {
        optionName['privilege'] = 2
        selectedOptions.push(optionName)
<<<<<<< HEAD
        for(let i=0; i<=options.length-1; i++){
          if(options[i].realName == optionName.realName){
           options.splice(i,1);
=======
        for (let i = 0; i <= options.length - 1; i++) {
          if (options[i].realName == optionName.realName) {
            if (i == 0) {
              options.splice(i, i + 1)
            } else {
              options.splice(i, i)
            }
>>>>>>> cea2071e64ccbb2e050a6de2c6d0eb5128baf1c4
          }
        }
        //
      }
    } else {
      let isSide = delPartner(readOptions, optionName)
      if (!isSide) {
        optionName['privilege'] = 1
        readOptions.push(optionName)
<<<<<<< HEAD
        for(let i=0; i<=options.length-1; i++){
          if(options[i].realName== optionName.realName){
            options.splice(i,1);
=======
        for (let i = 0; i <= options.length - 1; i++) {
          if (options[i].realName == optionName.realName) {
            if (i == 0) {
              options.splice(i, i + 1)
            } else {
              options.splice(i, i)
            }
>>>>>>> cea2071e64ccbb2e050a6de2c6d0eb5128baf1c4
          }
        }
        //
      }
    }
    this.setState({ options })
  }

  handleDeselect = writeReadOptions => {
    let { options, selectedOptions } = this.props
<<<<<<< HEAD
      let isSide = delPartner(options, writeReadOptions)
      if (!isSide) {
        writeReadOptions['privilege'] = 0;
        options.push(writeReadOptions)
        for(let i=0; i<=selectedOptions.length-1; i++){
          if(selectedOptions[i].realName == writeReadOptions.realName){
            selectedOptions.splice(i,1);

=======
    let isSide = delPartner(options, writeReadOptions)
    if (!isSide) {
      writeReadOptions['privilege'] = 0
      options.push(writeReadOptions)
      for (let i = 0; i <= selectedOptions.length - 1; i++) {
        if (selectedOptions[i].realName == writeReadOptions.realName) {
          if (i == 0) {
            selectedOptions.splice(i, i + 1)
          } else {
            selectedOptions.splice(i, i)
>>>>>>> cea2071e64ccbb2e050a6de2c6d0eb5128baf1c4
          }
        }
      }
    }
    this.setState({ writeReadOptions })
  }

  readDeselect = onlyReadOptions => {
    let { options, readOptions } = this.props
    let isSide = delPartner(options, onlyReadOptions)
    if (!isSide) {
      onlyReadOptions['privilege'] = 0
      options.push(onlyReadOptions)
<<<<<<< HEAD
      for(let i=0; i<=readOptions.length-1; i++){
        if(readOptions[i].realName == onlyReadOptions.realName){
          readOptions.splice(i,1);
=======
      for (let i = 0; i <= readOptions.length - 1; i++) {
        if (readOptions[i].realName == onlyReadOptions.realName) {
          if (i == 0) {
            readOptions.splice(i, i + 1)
          } else {
            readOptions.splice(i, i)
          }
>>>>>>> cea2071e64ccbb2e050a6de2c6d0eb5128baf1c4
        }
      }
    }
    this.setState({ onlyReadOptions })
  }

  render() {
    const { options, selectedOptions, readOptions } = this.props
    let disabled = findPrivileges(readOptions)
    return (
      <Row type="flex" className={style.partner}>
        <Col span={8}>
          <div className={style.left}>
            {'所有人员'}
            <select multiple ref={this._selectRef}>
              {options.map(option => {
                return (
                  <Popconfirm
                    title="添加权限至"
                    onConfirm={this.handleSelect.bind(this, 1, option)}
                    onCancel={this.handleSelect.bind(this, 2, option)}
                    okText="读写"
                    cancelText="只读"
                  >
                    <option
                      value={option.realName}
                      key={option.realName}
                      disabled={disabled}
                    >
                      {option.realName}
                    </option>
                  </Popconfirm>
                )
              })}
            </select>
          </div>
        </Col>
        <Col span={8}>
          <div className={style.center}>
            {'读写权限'}
            <select multiple ref={this._selectRef}>
              {selectedOptions.map(option => {
                return (
                  <Popconfirm
                    title="是否从读写删除此用户？"
                    onConfirm={this.handleDeselect.bind(this, option)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <option
                      value={option.realName}
                      key={option.realName}
                      disabled={disabled}
                    >
                      {option.realName}
                    </option>
                  </Popconfirm>
                )
              })}
            </select>
          </div>
        </Col>
        <Col span={8}>
          <div className={style.right}>
            {'只读权限'}
            <select multiple ref={this._selectRef}>
              {readOptions.map(option => {
                return (
                  <Popconfirm
                    title="是否从只读删除此用户？"
                    onConfirm={this.readDeselect.bind(this, option)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <option
                      value={option.realName}
                      key={option.realName}
                      disabled={disabled}
                    >
                      {option.realName}
                    </option>
                  </Popconfirm>
                )
              })}
            </select>
          </div>
        </Col>
      </Row>
    )
  }
}

export default PartnerLists
