/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import { logoutUser, loginUser, queryPostList } from 'api'
import config from 'config'
import { deLangPrefix } from 'utils'
// import $ from 'jquery'
// window.$ = $
// window.jQuery = $
// export default $
// 菜单列表
let database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    zhName: '仪表盘',
    route: '/dashboard',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Users',
    zhName: '用户管理',
    icon: 'user',
    route: '/user',
  },
  {
    id: '7',
    breadcrumbParentId: '1',
    name: 'Posts',
    zhName: '项目管理',
    icon: 'shopping-cart',
    route: '/post',
  },
  {
    id: '6',
    breadcrumbParentId: '1',
    name: 'Management',
    zhName: '项目详情',
    icon: 'user',
  },
  {
    id: '61',
    breadcrumbParentId: '6',
    menuParentId: '6',
    name: 'vars',
    zhName: '工程项目',
    icon: 'area-chart',
    route: '/project/vars',
  },
  {
    id: '62',
    breadcrumbParentId: '6',
    menuParentId: '6',
    name: 'FMEA analysis',
    zhName: 'FMEA 分析',
    icon: 'area-chart',
    route: '/project/FMEA',
  },
  {
    id: '63',
    breadcrumbParentId: '6',
    menuParentId: '6',
    name: 'FTA analysis',
    zhName: 'FTA 分析',
    icon: 'area-chart',
    route: '/project/FTA',
  },
  {
    id: '4',
    route: '/project/FTA/onAnalysis',
  },
]

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        zhName: '仪表盘',
        router: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
  },
  effects: {
    *query({}, { call, put, select }) {
      let email = window.localStorage.getItem('username')
      let token = window.localStorage.getItem('token')
      if (email == null && token == null) {
        router.push({
          pathname: '/login',
        })
      } else {
        const queryInfo = yield call(
          loginUser,
          { email: email },
          { Authorization: token }
        )
        const { locationPathname } = yield select(_ => _.app)
        if (queryInfo.success && queryInfo.list.status == 1) {
          const postList = yield call(
            queryPostList,
            {},
            { Authorization: token }
          )
          console.log(postList)
          // yield put({
          //   type: 'querySuccess',
          //   payload: {
          //    projectLists:postList.list
          //   },
          // })
          sessionStorage.setItem('projectList', JSON.stringify(postList.list))
          let isAdmin = queryInfo.list.roles[0]
          sessionStorage.setItem('isAdmin', isAdmin)
          let user = {}
          //此处设置登录用户信息（username等）
          if (isAdmin == 'Administrator') {
            user = {
              id: 0,
              permissions: {
                role: 'admin',
                visit: [],
              },
              username: queryInfo.list.realName,
            }
          } else {
            user = {
              id: 1,
              permissions: {
                role: 'guest',
                visit: ['1', '21', '7', '6', '61', '62', '63', '4'],
              },
              username: queryInfo.list.realName,
            }
          }
          const { permissions } = user
          for (let i = 0; i <= postList.list.length - 1; i++) {
            if (postList.list[i].type == 'FMEAProject') {
              var newPost = {
                id: '',
                itemId: '',
                breadcrumbParentId: '62',
                menuParentId: '62',
                name: '',
                zhName: '',
                icon: 'area-chart',
                route: '',
              }
              newPost.id = postList.list[i].id
              newPost.itemId = postList.list[i].id
              newPost.zhName = postList.list[i].name
              newPost.route = '/project/FMEA' + '?projectId=' + newPost.itemId
            } else if (postList.list[i].type == 'FTAProject') {
              var newPost = {
                id: '',
                itemId: '',
                breadcrumbParentId: '63',
                menuParentId: '63',
                name: '',
                zhName: '',
                icon: 'area-chart',
                route: '',
              }
              newPost.id = postList.list[i].id
              newPost.itemId = postList.list[i].id
              newPost.zhName = postList.list[i].name
              newPost.route = '/project/FTA' + '?projectId=' + newPost.itemId
            } else {
              var newPost = {
                id: '',
                itemId: '',
                breadcrumbParentId: '61',
                menuParentId: '61',
                name: '',
                zhName: '',
                icon: 'area-chart',
                route: '',
              }
              newPost.id = postList.list[i].id
              newPost.itemId = postList.list[i].id
              newPost.zhName = postList.list[i].name
              newPost.route = '/project/vars' + '?projectId=' + newPost.itemId
            }
            console.log(newPost)
            let itemArrey = []
            database.map((item, index) => {
              itemArrey.push(item.id)
            })
            if (!itemArrey.includes(newPost.id)) {
              database.push(newPost)
            }
            if (isAdmin != 'Administrator') {
              permissions.visit.push(newPost.id)
            }
          }
          //添加原型工程项目
          if (isAdmin == 'Administrator') {
            var originProject = {
              id: '1b2cd8ab-6d6c-4a05-931b-e40607bd8b19',
              itemId: '1b2cd8ab-6d6c-4a05-931b-e40607bd8b19',
              breadcrumbParentId: '61',
              menuParentId: '61',
              name: 'originProject',
              zhName: '原型项目',
              icon: 'area-chart',
              route:
                '/project/vars?projectId=1b2cd8ab-6d6c-4a05-931b-e40607bd8b19',
            }
            if (
              !database.find(
                d => d.id == '1b2cd8ab-6d6c-4a05-931b-e40607bd8b19'
              )
            ) {
              database.unshift(originProject)
            }
          }
          let list = database
          let routeList = database
          if (permissions.role === 'admin') {
            permissions.visit = list.map(item => item.id)
          } else {
            routeList = list.filter(item => {
              const cases = [
                permissions.visit.includes(item.id),
                item.mpid
                  ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                  : true,
                item.bpid ? permissions.visit.includes(item.bpid) : true,
              ]
              return cases.every(_ => _)
            })
          }
          console.log(routeList)
          yield put({
            type: 'updateState',
            payload: {
              user,
              permissions,
              routeList,
            },
          })
          if (pathMatchRegexp('/login', window.location.pathname)) {
            router.push({
              pathname: '/dashboard',
            })
          }
        } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
          router.push({
            pathname: '/login',
            search: stringify({
              from: locationPathname,
            }),
          })
        }
      }
    },

    *signOut({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          user: {},
          permissions: { visit: [] },
          menu: [
            {
              id: '1',
              icon: 'laptop',
              name: 'Dashboard',
              zhName: '仪表盘',
              router: '/dashboard',
            },
          ],
        },
      })
      window.localStorage.clear()
      if (queryLayout(config.layouts) !== 'public') {
        router.push({
          pathname: '/login',
        })
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
    projectLists(state, { payload }) {
      state.projectLists = payload
    },
  },
}
