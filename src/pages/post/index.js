import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Button } from 'antd'
import { router } from 'utils'
import { stringify } from 'qs'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import List from './components/List'
import Modal from './components/Modal'
import Filter from './components/Filter'

const { TabPane } = Tabs

const EnumPostStatus = {
  PROJECT: 1,
  FMEA: 2,
  FTA: 3,
}

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Post extends PureComponent {
  render() {
    const { post, loading, location, i18n, dispatch } = this.props
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      selectedRowKeys,
      userList,
    } = post
    const { query, pathname } = location
    const listProps = {
      pagination,
      dataSource: list,
      loading: loading.effects['post/query'],
      onchangeItem(item) {
        dispatch({
          type: 'post/showModal',
          payload: {
            modalType: 'change',
            currentItem: item,
          },
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'post/showModal',
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
            type: 'post/updateState',
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
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      },
    }
    const modalProps = {
      start: query.status === undefined ? '1' : query.status,
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`user/${modalType}`],
      title: `${modalType === 'create' ? '创建项目' : '更新项目'}`,
      wrapClassName: 'vertical-center-modal',
      userData: list,
      userNameList: userList,
      level: this.props.dic,
      onOk(data) {
        dispatch({
          type: `post/${modalType}`,
          payload: data,
        }).then(() => {
          router.push({
            pathname,
            search: stringify({
              type: data.Type,
            }),
          })
        })
      },
      onCancel() {
        dispatch({
          type: 'post/hideModal',
        })
      },
    }

    const postType = ['WorkProject', 'FMEAProject', 'FTAProject']
    const handleTabClick = key => {
      router.push({
        pathname,
        search: stringify({
          type: postType[key - 1],
          status: key,
        }),
      })
    }
    const filterProps = {
      filter: {
        ...query,
      },
      onFilterChange(value) {
        handleTabClick({
          ...value,
          page: 1,
        })
      },
      onAdd() {
        dispatch({
          type: 'post/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
    return (
      <Page inner>
        <Filter {...filterProps} />
        <Tabs
          activeKey={
            query.status === String(EnumPostStatus.FTA)
              ? String(EnumPostStatus.FTA)
              : query.status === String(EnumPostStatus.FMEA)
              ? String(EnumPostStatus.FMEA)
              : String(EnumPostStatus.PROJECT)
          }
          onTabClick={handleTabClick}
        >
          <TabPane tab={i18n.t`Publised`} key={String(EnumPostStatus.PROJECT)}>
            <List {...listProps} />
          </TabPane>
          <TabPane tab={i18n.t`Unpublished`} key={String(EnumPostStatus.FMEA)}>
            <List {...listProps} />
          </TabPane>
          <TabPane tab={i18n.t`FTA`} key={String(EnumPostStatus.FTA)}>
            <List {...listProps} />
          </TabPane>
        </Tabs>
        {modalVisible && <Modal {...modalProps} />}
      </Page>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Post
