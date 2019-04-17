import React from 'react'
import { Row, Col, Button } from 'antd'
import styles from './index.less'
import GGEditor, { Flow, Mind } from 'gg-editor'
const data = {
  nodes: [
    {
      type: 'node',
      size: '70*70',
      shape: 'flow-circle',
      color: '#FA8C16',
      label: '起止节点',
      x: 55,
      y: 55,
      id: 'ea1184e8',
      index: 0,
    },
    {
      type: 'node',
      size: '70*70',
      shape: 'flow-circle',
      color: '#FA8C16',
      label: '结束节点',
      x: 55,
      y: 255,
      id: '481fbb1a',
      index: 2,
    },
  ],
  edges: [
    {
      source: 'ea1184e8',
      sourceAnchor: 2,
      target: '481fbb1a',
      targetAnchor: 0,
      id: '7989ac70',
      index: 1,
    },
  ],
}
const data2 = {
  roots: [
    {
      label: '中心主题',
      children: [
        {
          label: '分支主题 1',
        },
        {
          label: '分支主题 2',
        },
        {
          label: '分支主题 3',
        },
      ],
    },
  ],
}

class FlowPage extends React.Component {
  // renderFlow() {
  //   return (
  //     <Flow className={styles.flow} style={{height: 650 }} grid data={{}}/>
  //   )
  // }

  render() {
    return (
      <div className={styles.structurePage}>
        <Row>
          <Col span={18} className={styles.structure}>
            <GGEditor>
              <Flow style={{ width: 500, height: 500 }} data={data} />
            </GGEditor>
          </Col>
          <Col span={6} className={styles.set}>
            col-12
          </Col>
        </Row>
        <Row>
          <Col span={24} className={styles.view}>
            <GGEditor>
              <Mind style={{ width: 500, height: 250 }} data={data2} />
            </GGEditor>
          </Col>
        </Row>
      </div>
    )
  }
}

export default FlowPage
