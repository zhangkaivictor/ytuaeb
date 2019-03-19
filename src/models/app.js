/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import {  logoutUser, loginUser, queryPostList } from 'api'
import config from 'config'
import { deLangPrefix } from 'utils'

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
    route: '/project/FTA/:id',
  },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    zhName: '用户详情',
    route: '/user/:id',
  },
  // {
  //   id: '3',
  //   breadcrumbParentId: '1',
  //   name: 'Request',
  //   zhName: 'Request',
  //   icon: 'api',
  //   route: '/request',
  // },
  // {
  //   id: '4',
  //   breadcrumbParentId: '1',
  //   name: 'UI Element',
  //   zhName: 'UI组件',
  //   icon: 'camera-o',
  // },
  // {
  //   id: '45',
  //   breadcrumbParentId: '4',
  //   menuParentId: '4',
  //   name: 'Editor',
  //   zhName: 'Editor',
  //   icon: 'edit',
  //   route: '/UIElement/editor',
  // },
  // {
  //   id: '5',
  //   breadcrumbParentId: '1',
  //   name: 'Charts',
  //   zhName: 'Charts',
  //   icon: 'code-o',
  // },
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
        let email = window.localStorage.getItem('username');
        let token = window.localStorage.getItem('token');
        if(email == null && token == null){
          router.push({
            pathname: '/login'
          })
        }else {
        const queryInfo = yield call(loginUser, {'email':email} ,{'Authorization':token})
        const { locationPathname } = yield select(_ => _.app)
        if (queryInfo.success && queryInfo.list.status == 1) {
          const postList = yield call(queryPostList, {}, {'Authorization':token})

          let isAdmin = queryInfo.list.roles[0];
          let user = {}
          if(isAdmin == 'Administrator'){
            user = {
              id: 0,
              permissions: {
                role: 'admin',
                visit: [],
              }
            }
          }else {
            user = {
              id: 1,
              permissions: {
                role: 'guest',
                visit: ['1', '21', '7', '6', '61', '62', '63'],
              },
            }
          }
          const { permissions } = user;
          for(let i=0; i<= postList.list.length-1; i++){
            let newPost = {
              id: '',
              itemId: '',
              breadcrumbParentId: '63',
              menuParentId: '63',
              name: '',
              zhName: '',
              icon: 'area-chart',
              route: '',
            }
            newPost.id = postList.list[i].id;
            newPost.itemId = postList.list[i].id;
            newPost.zhName = postList.list[i].name;
            newPost.route = '/project/FTA/'+ newPost.itemId
            let itemArrey = [];
            database.map((item ,index) => {
                itemArrey.push(item.id)
            })
            if(!itemArrey.includes(newPost.id)){
              database.push(newPost)
            }
            if(isAdmin != 'Administrator'){
              permissions.visit.push(newPost.id)
            }
          }
          let list = database
          let routeList = database
          if (permissions.role === 'admin') {
            permissions.visit = list.map(item => item.id)
          } else {
            routeList = list.filter(item => {
              const cases = [permissions.visit.includes(item.id), item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
                item.bpid ? permissions.visit.includes(item.bpid) : true,
              ]
              return cases.every(_ => _)
            })
          }
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
        if (queryLayout(config.layouts) !== 'public') {
          router.push({
            pathname: '/',
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
  },
}
