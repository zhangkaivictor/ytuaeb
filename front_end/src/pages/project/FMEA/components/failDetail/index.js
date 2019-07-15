import React from 'react'
import { connect } from 'dva'
import { Card, Form, Input, Checkbox, InputNumber } from 'antd'
import { withPropsAPI } from 'gg-editor'
import styles from './index.less'

const { Item } = Form
const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 12 },
  },
}
@connect(({ FTA, loading }) => ({ FTA, loading }))
class FailDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      qchecked: false,
    }
  }

  componentWillMount() {}

  handleSubmit = e => {
    const { form, dispatch } = this.props
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'FMEA/failAttrSet', payload: values })
      }
    })
  }
  onChangeq = e => {
    let checked = `${e.target.checked}`
    this.setState({ qchecked: JSON.parse(checked) })
  }
  render() {
    const { form, FMEA } = this.props
    const { getFieldDecorator } = form
    return (
      <Card
        type="inner"
        title="失效属性"
        bordered={false}
        headStyle={{ backgroundColor: '#e5e5e5' }}
      >
        <Form onSubmit={this.handleSubmit}>
          <Item
            label="O"
            {...inlineFormItemLayout}
            className={styles.itemMargin}
          >
            {getFieldDecorator('O', {
              initialValue: FMEA.selectedFail.oValue,
            })(
              <InputNumber
                onBlur={this.handleSubmit}
                style={{ width: '100%' }}
              />
            )}
          </Item>
          <Item
            label="D"
            {...inlineFormItemLayout}
            className={styles.itemMargin}
          >
            {getFieldDecorator('D', {
              initialValue: FMEA.selectedFail.dValue,
            })(
              <InputNumber
                onBlur={this.handleSubmit}
                style={{ width: '100%' }}
              />
            )}
          </Item>
          <Item
            label="λ"
            {...inlineFormItemLayout}
            className={styles.itemMargin}
          >
            {getFieldDecorator('λ', {
              initialValue: FMEA.selectedFail.lambdaValue,
            })(
              <InputNumber
                onBlur={this.handleSubmit}
                style={{ width: '100%' }}
              />
            )}
          </Item>
          <Item
            label="S"
            {...inlineFormItemLayout}
            className={styles.itemMargin}
          >
            {getFieldDecorator('S', {
              initialValue: FMEA.selectedFail.sValue,
            })(
              <Input
                type="number"
                addonAfter={
                  <Checkbox
                    checked={this.state.qchecked}
                    onChange={this.onChangeq.bind(this)}
                  />
                }
                onBlur={this.handleSubmit}
                disabled={!this.state.qchecked}
              />
            )}
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(withPropsAPI(FailDetail))
