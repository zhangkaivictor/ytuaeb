import React from 'react';
import { connect } from 'dva'
import { Card, Form, Input,Checkbox,Switch } from 'antd';
import { withPropsAPI } from 'gg-editor';
import styles from './index.less'

const { Item } = Form;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

@connect(({ FTA, loading }) => ({ FTA, loading }))
class NodeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Qchecked: false,
      qchecked: false,
    };
  }

  componentWillMount() {
    const { propsAPI } = this.props;
    const { getSelected, update, executeCommand } = propsAPI;
    const { nodes } = propsAPI.save();

    const item = getSelected()[0];
    const { smallFailureRateQValueType,invalidRateValueIsModifiedByUser } = item.getModel();
    this.setState({Qchecked : invalidRateValueIsModifiedByUser})
    this.setState({qchecked : smallFailureRateQValueType})
  }
  handleSubmit = (e) => {
    e.preventDefault();

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, find, update } = propsAPI;
    const {nodes} = propsAPI.save();

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const item = getSelected()[0];
      const itemsModel = item.getModel();
      itemsModel.invalidRateValueIsModifiedByUser = this.state.Qchecked;
      itemsModel.smallFailureRateQValueType = this.state.qchecked;

      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });

      for (let i=0; i <= nodes.length-1; i++){
        if(item.model.name == nodes[i].name){
          let nextItem = find(nodes[i].id);
          executeCommand(() => {
            update(nextItem, {
              ...values,
              id:nodes[i].id,
            });
          });
        }
      }

    });
  }
  onChangeQ = (e) => {
    let checked = `${e.target.checked}`;
    this.setState({Qchecked : JSON.parse(checked)})
  }
  onChangeq = (e) => {
    let checked = `${e.target.checked}`;
    this.setState({qchecked : JSON.parse(checked)})
  }

  render() {
    const { form, propsAPI, isHideScreen } = this.props;
    const { getFieldDecorator } = form;
    const { getSelected } = propsAPI;

    const item = getSelected()[0];
    const itemType = ["andGate","orGate","nonGate"];

    if (!item) {
      return null;
    }
    const { name, note, id, shape, failureRateQ, invalidRate, failureTime,
      dCrf, dClf, referenceFailureRateq,invalidRateValueIsModifiedByUser,smallFailureRateQValueType} = item.getModel();
    if(itemType.indexOf(shape)>=0){
      return null;
    }else {
      return (
        <Card type="inner" title="节点属性" bordered={false} headStyle={{ backgroundColor:'#e5e5e5'}}>
          <Form onSubmit={this.handleSubmit}>
            <Item
              label="ID"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('id', {
                  initialValue: id,
                })(<Input onBlur={this.handleSubmit} disabled/>)
              }
            </Item>
            <Item
              label="name"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('name', {
                  initialValue: name,
                })(<Input onBlur={this.handleSubmit} />)
              }
            </Item>
            <Item
              label="note"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('note', {
                  initialValue: note,
                })(<Input onBlur={this.handleSubmit} />)
              }
            </Item>
            <Item
              label="Q"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('failureRateQ', {
                  initialValue: failureRateQ,
                })(<Input onBlur={this.handleSubmit} addonAfter={(<Checkbox checked={this.state.Qchecked} onChange={this.onChangeQ.bind(this)} onBlur={this.handleSubmit}/>)} disabled={!this.state.Qchecked}/>)
              }

            </Item>
            <Item
              label="λ"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('invalidRate', {
                  initialValue: invalidRate,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="T"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('failureTime', {
                  initialValue: failureTime,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="dCrf"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('dCrf', {
                  initialValue: dCrf,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="dClf"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('dClf', {
                  initialValue: dClf,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="q"
              {...inlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('referenceFailureRateq', {
                  initialValue: referenceFailureRateq,
                })(
                  <Input addonAfter={(<Checkbox checked={this.state.qchecked} onChange={this.onChangeq.bind(this)} onBlur={this.handleSubmit}/>)} onBlur={this.handleSubmit} disabled={!this.state.qchecked}/>
                )
              }
            </Item>
          </Form>
        </Card>
      );
    }
  }
}

export default Form.create()(withPropsAPI(NodeDetail));
