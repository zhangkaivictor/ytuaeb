import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'

class dependEditModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleOk = () => {
    const { onOk, form } = this.props
  }

  componentDidMount() {}
  render() {
    return <Modal onOk={this.handleOk}>{'edit'}</Modal>
  }
}

dependEditModal.propTypes = {
  type: PropTypes.number,
  state: PropTypes.object,
  onOk: PropTypes.func,
  handleChange: PropTypes.func,
  handleDeselect: PropTypes.func,
}

export default dependEditModal
