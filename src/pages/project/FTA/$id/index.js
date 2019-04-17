import React from 'react';
import { withPropsAPI } from 'gg-editor';
import { Row, Col, Button } from 'antd';
import GGEditor, { Flow } from 'gg-editor';
import EditorMinimap from '../components/EditorMinimap/index';
import { FlowContextMenu } from '../components/EditorContextMenu/index';
import { FlowToolbar } from '../components/EditorToolbar/index';
import EditorItemPanel from '../components/EditorItemPanel/index';
import { FlowDetailPanel } from '../components/EditorDetailPanel/index';
import Save from "../components/Save";

import { modelTree} from './components/modelTree'
import styles from './index.less';

let data = {};
class FlowPage extends React.Component {
  renderFlow() {
    return (
      <Flow className={styles.flow} style={{height: 650 }} grid data={{}}/>
    )
  }

  render() {
    return (
      <GGEditor className={styles.editor}>
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <FlowToolbar />
            <div className={styles.save}>
              <Save />
              <Button onClick={this.handleSaveClick}>分析</Button>
            </div>
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={4} className={styles.editorSidebar}>
            <EditorItemPanel />
          </Col>
          <Col span={16} className={styles.editorContent}>
            {this.renderFlow()}
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <FlowDetailPanel />
            <EditorMinimap />
          </Col>
        </Row>
        <FlowContextMenu />
      </GGEditor>
    );
  }
}

export default withPropsAPI(FlowPage);
