import React from 'react';
import { Card } from 'antd';
import { Minimap } from 'gg-editor';

class EditorMinimap extends React.Component {
  render() {
    return (
      <Card type="inner" title="缩略图" bordered={false} headStyle={{ backgroundColor:'#e5e5e5'}}>
        <Minimap height={200}/>
      </Card>
    );
  }
}

export default EditorMinimap;
