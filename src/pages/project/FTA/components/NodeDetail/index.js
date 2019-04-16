import React from 'react';
import { connect } from 'dva'
import { Card, Form, Input } from 'antd';
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
const tenlineFormItemLayout = {
  labelCol: {
    sm: { span: 10},
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};
const eightlineFormItemLayout = {
  labelCol: {
    sm: { span: 8},
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
const onlineFormItemLayout = {
  labelCol: {
    sm: { span: 18},
  },
  wrapperCol: {
    sm: { span: 6 },
  },
};

@connect(({ FTA, loading }) => ({ FTA, loading }))
class NodeDetail extends React.Component {
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
            let nextId = nodes[i].id;
            let nextItem = find(nextId);
            executeCommand(() => {
              update(nextItem, {
                ...values,
              });
            });
        }
      }

    });
  }

  componentWillMount() {
    const { propsAPI } = this.props;
    const { getSelected, update, executeCommand } = propsAPI;
    const { nodes } = propsAPI.save();

    const item = getSelected()[0];

    const { name, failureRateQ } = item.getModel();
    if(failureRateQ == ""){
      nodes.some(itemNode => {
        if(itemNode.name == name && itemNode.failureRateQ != ""){
          executeCommand(() => {
            update(item, {
              "failureRateQ":itemNode.failureRateQ,
              "invalidRate":itemNode.invalidRate,
              "failureTime":itemNode.failureTime,
              "dCrf":itemNode.dCrf,
              "dClf":itemNode.dClf,
              "referenceFailureRateq":itemNode.referenceFailureRateq
            });
          });
        }
      })
    }

  }

  render() {
    const { form, propsAPI } = this.props;
    const { getFieldDecorator } = form;
    const { getSelected } = propsAPI;

    const item = getSelected()[0];
    const itemType = ["andGate","orGate","nonGate"];

    if (!item) {
      return null;
    }

    const { name, note, shape, failureRateQ, invalidRate, failureTime, dCrf, dClf, referenceFailureRateq} = item.getModel();

    if(itemType.indexOf(shape)>=0){
      return null;
    }else {
      return (
        <Card type="inner" title="节点属性" bordered={false} headStyle={{ backgroundColor:'#e5e5e5'}}>
          <Form onSubmit={this.handleSubmit}>
            <Item
              label="标签"
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
              label="注释"
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
              label="失效概率"
              {...tenlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('failureRateQ', {
                  initialValue: failureRateQ,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="失效率"
              {...eightlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('invalidRate', {
                  initialValue: invalidRate,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="时间"
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
              label="单点故障覆盖率"
              {...onlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('dCrf', {
                  initialValue: dCrf,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>
            <Item
              label="潜伏故障覆盖率"
              {...onlineFormItemLayout}
              className={styles.mapType}
            >
              {
                getFieldDecorator('dClf', {
                  initialValue: dClf,
                })(<Input onBlur={this.handleSubmit} />)
              }

            </Item>

          </Form>
        </Card>
      );
    }
  }
}

export default Form.create()(withPropsAPI(NodeDetail));
