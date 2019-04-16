import React from "react";
import { connect } from 'dva'
import { Flow, withPropsAPI } from "gg-editor";
import styles from './index.less';

@connect(({ FTA, loading }) => ({ FTA, loading }))
class FlowMap extends React.Component{

  render() {
    const { data } = this.props;
    let mapData = {};
    if(data != null){
      mapData = JSON.parse(data)
      delete mapData.attributes;
    }else {
      mapData = {}
    }
    return (
      <Flow className={styles.flow} style={{height: 650 }} grid data={mapData} />
    )
  }
}

export default withPropsAPI(FlowMap);
