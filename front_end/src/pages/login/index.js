import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon, Input } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './index.less'
const FormItem = Form.Item

@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent {
  handleOk = () => {
    const { dispatch, form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  render() {
    const { loading, form, i18n } = this.props
    const { getFieldDecorator } = form

    return (
      <Fragment>
        <div className={styles.companyLogo}>
          <img alt="logo" src={config.logoPath} />
          {/* <span>{config.siteName}</span> */}
        </div>
        <div className={styles.left}>
          {/* <img src={config.leftPath} alt="" /> */}
        </div>
        <div className={styles.form}>
          <div className={styles.logo}>
            <span>{'登录系统'}</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`Username`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  type="password"
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`Password`}
                />
              )}
            </FormItem>
            <Row>
              <Button
                type="primary"
                onClick={this.handleOk}
                loading={loading.effects.login}
              >
                <Trans>Sign in</Trans>
              </Button>
            </Row>
          </form>
        </div>
        <div className={styles.footer}>
          <GlobalFooter links={[]} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
