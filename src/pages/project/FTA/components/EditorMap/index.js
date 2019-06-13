import React from 'react'
import { connect } from 'dva'
import { Flow, withPropsAPI } from 'gg-editor'
import styles from './index.less'

@connect(({ FTA, loading }) => ({ FTA, loading }))
class FlowMap extends React.Component {
  render() {
    const { FTA, isHideScreen } = this.props
    let data = FTA.list.content
    var mapData = {}
    if (data != null && data != undefined) {
      mapData = eval('(' + data + ')')
      // mapData = JSON.parse(data)
      delete mapData.attributes
      mapData.nodes.forEach(item => {
        item.checkDis = isHideScreen
        //添加style
        item.style = {
          stroke: `${item.color ? item.color : ''}`,
          fill: `${item.color ? item.color : ''}`,
        }
      })
    } else {
      mapData = {}
    }
    console.log(mapData)

    return (
      <Flow className={styles.flow} style={{ height: 750 }} data={mapData} />
    )
  }
}

export default withPropsAPI(FlowMap)
