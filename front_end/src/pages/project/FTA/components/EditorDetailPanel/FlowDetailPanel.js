import React from 'react'
import { Card } from 'antd'
import {
  NodePanel,
  EdgePanel,
  GroupPanel,
  MultiPanel,
  CanvasPanel,
  DetailPanel,
} from 'gg-editor'
import NodeDetail from '../NodeDetail'
import GroupDetail from '../GroupDetail'
import styles from './index.less'

class FlowDetailPanel extends React.Component {
  render() {
    const { isHideScreen } = this.props
    const nodePanelProps = {
      isHideScreen: isHideScreen,
    }
    return (
      <DetailPanel className={styles.detailPanel}>
        <NodePanel>
          <NodeDetail {...nodePanelProps} />
        </NodePanel>
        <GroupPanel>
          <GroupDetail />
        </GroupPanel>
        <MultiPanel>
          <Card
            type="inner"
            title="多选属性"
            bordered={false}
            headStyle={{ backgroundColor: '#e5e5e5' }}
          />
        </MultiPanel>
        <CanvasPanel>
          <Card
            type="inner"
            title="画布属性"
            bordered={false}
            headStyle={{ backgroundColor: '#e5e5e5' }}
          />
        </CanvasPanel>
      </DetailPanel>
    )
  }
}

export default FlowDetailPanel
