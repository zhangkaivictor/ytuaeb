import React, { Fragment } from 'react'
import { connect } from 'dva'
import { Card, Form, Input,InputNumber, Checkbox, Switch } from 'antd'
import { withPropsAPI } from 'gg-editor'
import styles from './index.less'

const { Item } = Form

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
}
const toNonExponential = (num) => {
//  console.log(num)
  // console.log(Number("1e-5"))
  // console.log(Number(num).toExponential())
  if(!isNaN(Number(num))){
    // let m = Number(num).toFixed(6)
    // console.log(m)
    let m=Number(num).toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  // console.log(m)
  // console.log(Math.max(0, (m[1] || '').length - m[2]))
    // return Number(num).toFixed(Math.max(0, (m[1] || '').length - m[2]));
    return m[0];
  }else{
    return 'NaN'
  }
}
//科学计数法
const num2e = (num) => {
  var p = Math.floor(Math.log(num) / Math.LN10)
  var n = num * Math.pow(10, -p);
  return n + 'e' + p;
}
@connect(({ FTA, loading }) => ({ FTA, loading }))
class SubNode extends React.Component {
  //const tNode= React.ReactNode()``
  //
  render() {
    return (
      <span style={{ height: '39px' }}>DC<sub>{this.props.f}</sub></span>
    )
  }
}
class NodeDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      invalidRateChecked: false,
      qchecked: false,
      display_name: 'none',
    }
  }

  componentWillMount() {
    const { propsAPI } = this.props
    const { getSelected, update, executeCommand } = propsAPI
    const { nodes } = propsAPI.save()

    const item = getSelected()[0]
    const {
      shape,
      smallFailureRateQValueType,
      invalidRateValueIsModifiedByUser,
    } = item.getModel()
    this.setState({ invalidRateChecked: invalidRateValueIsModifiedByUser })
    this.setState({ qchecked: smallFailureRateQValueType })
    if (shape == 'round') {
      this.setState({ display_name: 'block' })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, propsAPI } = this.props
    const { getSelected, executeCommand, find, update } = propsAPI
    const { nodes } = propsAPI.save()

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      const item = getSelected()[0]
      const itemsModel = item.getModel()
      itemsModel.invalidRateValueIsModifiedByUser = this.state.invalidRateChecked
      itemsModel.smallFailureRateQValueType = this.state.qchecked

      if (!item) {
        return
      }
      executeCommand(() => {
        update(item, {
          ...values,
        })
      })

      for (let i = 0; i <= nodes.length - 1; i++) {
        if (item.model.name == nodes[i].name) {
          let nextItem = find(nodes[i].id)
          executeCommand(() => {
            update(nextItem, {
              ...values,
              id: nodes[i].id,
            })
          })
        }
      }
    })
  }
  onChangeQ = e => {
    let checked = `${e.target.checked}`
    this.setState({ invalidRateChecked: JSON.parse(checked) })
  }
  onChangeq = e => {
    let checked = `${e.target.checked}`
    this.setState({ qchecked: JSON.parse(checked) })
  }

  render() {
    const { form, propsAPI, isHideScreen } = this.props
    const { getFieldDecorator } = form
    const { getSelected } = propsAPI

    const item = getSelected()[0]
    const itemType = ['andGate', 'orGate', 'nonGate']
    if (!item) {
      return null
    }
    let {
      name,
      note,
      id,
      shape,
      failureRateQ,
      invalidRate,
      failureTime,
      dCrf,
      dClf,
      smallFailureRateQ,
      invalidRateValueIsModifiedByUser,
      smallFailureRateQValueType,
    } = item.getModel();
    // console.log(item.getModel());
    // if (shape == 'round') {
    //   if (!this.state.qchecked) {
    //     failureRateQ = Number(invalidRate) * Number(failureTime) * 0.000000001;
    //     // smallFailureRateQ = Number(invalidRate)*(1-Number(dCrf))*Number(failureTime);
    //   }
    // } else {
    //   if (this.state.invalidRateChecked) {
    //     failureRateQ = Number(invalidRate) * Number(failureTime) * 0.000000001;
    //   } else {
    //     failureRateQ = smallFailureRateQ;
    //     invalidRate = failureRateQ / Number(failureTime);
    //   }
    // }
    if (itemType.indexOf(shape) >= 0) {
      return null
    } else {
      return (
        <Card
          type="inner"
          title="节点属性"
          bordered={false}
          headStyle={{ backgroundColor: '#e5e5e5' }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Item
              label="ID"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input onBlur={this.handleSubmit} disabled />)}
            </Item>
            <Item
              label="name"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('name', {
                initialValue: name,
              })(<Input onBlur={this.handleSubmit} />)}
            </Item>
            <Item
              label="note"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('note', {
                initialValue: note,
              })(<Input onBlur={this.handleSubmit} />)}
            </Item>
            <Item
              label="Q"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('failureRateQ', {
                initialValue: toNonExponential(failureRateQ),
              })(
                <Input
                type="number"
                min={0}
                  onBlur={this.handleSubmit}
                  disabled={true}
                />,
              )}
            </Item>
            <Item
              label="λ"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('invalidRate', {
                initialValue: toNonExponential(invalidRate),
              })(<Input min={0} type="number" onBlur={this.handleSubmit}
                addonAfter={
                  <Checkbox
                    checked={this.state.invalidRateChecked}
                    onChange={this.onChangeQ.bind(this)}
                    onBlur={this.handleSubmit}
                  />
                }
                disabled={!this.state.invalidRateChecked} />)}
            </Item>
            <Item
              label="T"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('failureTime', {
                initialValue: failureTime,
              })(<InputNumber min={0} onBlur={this.handleSubmit} />)}
            </Item>
            <Item
              label={<SubNode f={'RF'} />}
              {...inlineFormItemLayout}
              className={styles.mapType}
              style={{ display: this.state.display_name }}
            >
              {getFieldDecorator('dCrf', {
                initialValue: dCrf,
              })(<InputNumber min={0} max={1} onBlur={this.handleSubmit} />)}
            </Item>
            <Item
              label={<SubNode f={'LF'} />}
              {...inlineFormItemLayout}
              className={styles.mapType}
              style={{ display: this.state.display_name }}
            >
              {getFieldDecorator('dClf', {
                initialValue: dClf,
              })(<InputNumber min={0} max={1} onBlur={this.handleSubmit} />)}
            </Item>
            <Item
              label="q"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {getFieldDecorator('smallFailureRateQ', {
                initialValue: toNonExponential(smallFailureRateQ),
              })(
                <Input
                  addonAfter={
                    <Checkbox
                      checked={this.state.qchecked}
                      onChange={this.onChangeq.bind(this)}
                      onBlur={this.handleSubmit}
                    />
                  }
                  type="number"
                  onBlur={this.handleSubmit}
                  disabled={!this.state.qchecked}
                  style={{ minWidth: '135.5px' }}
                />,
              )}
            </Item>
          </Form>
        </Card>
      )
    }
  }
}

export default Form.create()(withPropsAPI(NodeDetail))
