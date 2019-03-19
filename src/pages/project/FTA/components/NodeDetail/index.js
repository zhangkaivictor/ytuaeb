import React from 'react';
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

class NodeDetail extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

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
    });
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
