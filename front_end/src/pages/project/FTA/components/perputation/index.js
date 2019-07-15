import React from 'react'
import { router } from 'utils'
import { withPropsAPI } from 'gg-editor'
import { Row, Col, Button } from 'antd'
import { message } from 'antd'

class Perputation extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }
  handleClick = () => {
    const { onOk, propsAPI } = this.props
    let saveData = propsAPI.save()
    if (Object.keys(saveData).length == 0) {
      message.error('画布为空,无法分析！！！')
      return
    } else {
      let nodes = saveData.nodes
    }
    let data = {
      Content: JSON.stringify(saveData),
    }
    onOk(data)
  }
  perputation() {
    const { dispatch, FTA } = this.props
    // console.log(JSON.parse(FTA.list.content))
    let data = FTA.list.content
    var mapData = {}
    if (data != null && data != undefined) {
      mapData = eval('(' + data + ')')
      // mapData = JSON.parse(data)
      // delete mapData.attributes
      // mapData.nodes.forEach(item => {
      //   item.checkDis = isHideScreen
      //   //添加style
      //   item.style = {
      //     stroke: `${item.color ? item.color : ''}`,
      //     fill: `${item.color ? item.color : ''}`,
      //   }
      // })
    } else {
      mapData = {}
    }
    if (!mapData) {
      message.info('没有排列的信息')
      return
    }
    if (!mapData.nodes) {
      message.error('未找到根节点！')
      return
    }
    dispatch({ type: 'FTA/perputation', payload: { data: mapData } })
  }
  render() {
    return <Button onClick={e => this.perputation(e)}>排列</Button>
  }
}

export default withPropsAPI(Perputation)
