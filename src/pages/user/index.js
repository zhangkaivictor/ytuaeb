import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'
const findAdminFn = arr => {
  let newArr = []
  for (let i = 0; i <= arr.length - 1; i++) {
    if (!arr[i].roles.includes('Administrator')) {
      newArr.push(arr[i])
    }
  }
  return newArr
}
@withI18n()
@connect(({ user, loading }) => ({ user, loading }))
class User extends PureComponent {
  render() {
    const { location, dispatch, user, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      selectedRowKeys,
    } = user

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`user/${modalType}`],
      title: `${
        modalType === 'create'
          ? i18n.t`Create User`
          : modalType === 'update'
          ? i18n.t`Update User`
          : '修改密码'
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `user/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'user/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: findAdminFn(list),
      loading: loading.effects['user/query'],
      pagination,
      onchangeItem(item) {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'change',
            currentItem: item,
          },
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'user/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
      onChange(page) {
        router.push({
          pathname,
          search: stringify({
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      },
    }

    const filterProps = {
      filter: {
        ...query,
      },
      onFilterChange(value) {
        handleRefresh({
          ...value,
          page: 1,
        })
      },
      onAdd() {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    const handleRefresh = newQuery => {
      if (
        newQuery != undefined &&
        newQuery.name != '' &&
        newQuery.name != undefined
      ) {
        let searchDate = []
        listProps.dataSource.map((item, index) => {
          if (item.realName.indexOf(newQuery.name) >= 0) {
            searchDate.push(item)
          }
        })
        dispatch({
          type: 'user/search',
          payload: {
            searchDate,
            ...newQuery,
          },
        })
      } else {
        router.push({
          pathname,
          search: stringify(
            {
              ...query,
              ...newQuery,
            },
            { arrayFormat: 'repeat' }
          ),
        })
      }
    }
    return (
      <Page inner>
        <Filter {...filterProps} />
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </Page>
    )
  }
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default User
