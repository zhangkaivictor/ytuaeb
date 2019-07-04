import React from 'react'
import { Row, Col, Button } from 'antd'
import { withPropsAPI } from 'gg-editor'

class Full extends React.Component {
  state = {
    //检测全屏状态
    isFullScreen: false,
  }

  componentDidMount() {
    this.watchFullScreen()
  }

  fullScreen = () => {
    console.log('fullscreen:', this.state.isFullScreen)
    if (!this.state.isFullScreen) {
      this.requestFullScreen()
    } else {
      this.exitFullscreen()
    }
  }

  //进入全屏
  requestFullScreen = () => {
    console.log('requestFullScreen')
    // var de = document.documentElement
    var de = document.getElementById('ggFMEA')
    console.log(de)
    // console.log(ggFMEA)
    if (de.requestFullscreen) {
      de.requestFullscreen()
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen()
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen()
    }
  }
  //退出全屏
  exitFullscreen = () => {
    console.log('exitFullscreen')
    var de = document
    if (de.exitFullscreen) {
      de.exitFullscreen()
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen()
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen()
    }
  }

  //监听fullscreenchange事件
  watchFullScreen = () => {
    const _self = this
    document.addEventListener(
      'fullscreenchange',
      function() {
        _self.setState({
          isFullScreen: document.fullscreen,
        })
      },
      false
    )

    document.addEventListener(
      'mozfullscreenchange',
      function() {
        _self.setState({
          isFullScreen: document.mozFullScreen,
        })
      },
      false
    )

    document.addEventListener(
      'webkitfullscreenchange',
      function() {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen,
        })
      },
      false
    )
  }
  render() {
    const { isFullScreen } = this.state
    return (
      <Button onClick={this.fullScreen} style={{ marginLeft: '10px' }}>
        {isFullScreen ? '退出全屏' : '全屏'}
      </Button>
    )
  }
}

export default withPropsAPI(Full)
