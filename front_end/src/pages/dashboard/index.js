import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import {
  NumberCard,
  Quote,
  Sales,
  // Weather,
  RecentSales,
  Comments,
  Completed,
  Browser,
  Cpu,
  Log,
  User,
} from './components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  avatar: app.user.avatar,
  username: app.user.username,
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    console.log(this.props)
    const { avatar, username, dashboard, loading } = this.props
    const {
      weather,
      projectsActivitiesCount,
      quote,
      numbers,
      recentSales,
      comments,
      completed,
      recentOpen,
      recentOperate,
      cpu,
      user,
    } = dashboard
    const numberCards = numbers.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <NumberCard {...item} />
      </Col>
    ))

    return (
      <Page
        // loading={loading.models.dashboard && sales.length === 0}
        className={styles.dashboard}
      >
        <Row gutter={24}>
          <Col lg={8} md={24}>
            <Card
              bordered={false}
              bodyStyle={{ ...bodyStyle.bodyStyle, padding: 0 }}
            >
              <User {...user} avatar={avatar} username={username} />
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <Browser data={recentOperate} />
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card bordered={false} {...bodyStyle}>
              {/* <ScrollBar>
                <Cpu {...cpu} />
              </ScrollBar> */}
              <Log data={recentOpen} />
            </Card>
          </Col>

          {/* {numberCards} */}
          <Col lg={24} md={24}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: '24px 36px 24px 0',
              }}
            >
              <Sales data={projectsActivitiesCount} />
            </Card>
          </Col>
          {/* <Col lg={6} md={24}>
            <Row gutter={24}>
              <Col lg={24} md={12}>
                <Card
                  bordered={false}
                  className={styles.weather}
                  bodyStyle={{
                    padding: 0,
                    height: 204,
                    background: Color.blue,
                  }}
                >
                  
                </Card>
              </Col>
              <Col lg={24} md={12}>
                <Card
                  bordered={false}
                  className={styles.quote}
                  bodyStyle={{
                    padding: 0,
                    height: 204,
                    background: Color.peach,
                  }}
                >
                  <ScrollBar>
                    <Quote {...quote} />
                  </ScrollBar>
                </Card>
              </Col>
            </Row>
          </Col> */}
          {/* <Col lg={12} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <RecentSales data={recentSales} />
            </Card>
          </Col>
          <Col lg={12} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <ScrollBar>
                <Comments data={comments} />
              </ScrollBar>
            </Card>
          </Col>
          <Col lg={24} md={24}>
            <Card
              bordered={false}
              bodyStyle={{
                padding: '24px 36px 24px 0',
              }}
            >
              <Completed data={completed} />
            </Card>
          </Col>
           */}
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
