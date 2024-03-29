import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { queryDashboard, queryWeather, queryLog } from 'api'
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

const Dashboard = {
  projectsActivitiesCount: [
    { name: 2008, Clothes: 405, Food: 196, Electronics: 309 },
    { name: 2009, Clothes: 391, Food: 377, Electronics: 482 },
    { name: 2010, Clothes: 371, Food: 386, Electronics: 378 },
    { name: 2011, Clothes: 287, Food: 302, Electronics: 354 },
    { name: 2012, Clothes: 209, Food: 205, Electronics: 417 },
    { name: 2013, Clothes: 418, Food: 224, Electronics: 382 },
    { name: 2014, Clothes: 478, Food: 259, Electronics: 419 },
    { name: 2015, Clothes: 305, Food: 229, Electronics: 395 },
  ],
  cpu: {
    usage: 139,
    space: 825,
    cpu: 43,
    data: [
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
      [Object],
    ],
  },
  recentOperate: [],
  recentOpen: [
    { name: 'Google Chrome', percent: 43.3, status: 1 },
    { name: 'Mozilla Firefox', percent: 33.4, status: 2 },
    { name: 'Apple Safari', percent: 34.6, status: 3 },
    { name: 'Internet Explorer', percent: 12.3, status: 4 },
    { name: 'Opera Mini', percent: 3.3, status: 1 },
    { name: 'Chromium', percent: 2.53, status: 1 },
  ],
  user: { name: 'github', sales: 3241, sold: 3556 },
  completed: [
    { name: 2008, 'Task complete': 449, 'Cards Complete': 274 },
    { name: 2009, 'Task complete': 649, 'Cards Complete': 562 },
    { name: 2010, 'Task complete': 881, 'Cards Complete': 686 },
    { name: 2011, 'Task complete': 892, 'Cards Complete': 363 },
    { name: 2012, 'Task complete': 599, 'Cards Complete': 893 },
    { name: 2013, 'Task complete': 759, 'Cards Complete': 866 },
    { name: 2014, 'Task complete': 593, 'Cards Complete': 967 },
    { name: 2015, 'Task complete': 809, 'Cards Complete': 512 },
    { name: 2016, 'Task complete': 561, 'Cards Complete': 690 },
    { name: 2017, 'Task complete': 396, 'Cards Complete': 470 },
    { name: 2018, 'Task complete': 791, 'Cards Complete': 281 },
    { name: 2019, 'Task complete': 879, 'Cards Complete': 496 },
  ],
  comments: [
    {
      name: 'Jackson',
      status: 2,
      content:
        'Kcwixfbc jecfw ffvoxmejbb wswph plbmr pzzp fbqop fwmok evvrtwpeq ehrku etvdrbkrw cyivdh vsevso gvpgijpum bdpxl wdsgdo fwdwmfvl.',
      avatar: 'http://dummyimage.com/48x48/f27e79/757575.png&text=J',
      date: '2016-12-17 10:13:55',
    },
    {
      name: 'Robinson',
      status: 2,
      content:
        'Tnfj njvx gxknvrm jxtik qux wusgl dtbb iupjp zmbzetmi xqilad ewurwrr tbqzyx.',
      avatar: 'http://dummyimage.com/48x48/7997f2/757575.png&text=R',
      date: '2016-12-25 15:25:17',
    },
    {
      name: 'Anderson',
      status: 1,
      content:
        'Whflzmcmt oojvye fnjkritgs srceq qimpjcyryg ubnjwedln jwuxyg svewikoya rjgqsph fnmbujceug orpkibo nbanf ndiu pskw.',
      avatar: 'http://dummyimage.com/48x48/baf279/757575.png&text=A',
      date: '2016-04-14 04:11:22',
    },
    {
      name: 'Lopez',
      status: 2,
      content:
        'Jgfun dcroggu eyqxq hgcovmudr splfrfg xrxquv gepfonlg cxny yenkp xjnnqkotyf bfwwpffwd cxksc wjsyb srf rmnxswjact pknpyxmrc.',
      avatar: 'http://dummyimage.com/48x48/f279dd/757575.png&text=L',
      date: '2016-12-30 12:09:08',
    },
    {
      name: 'Johnson',
      status: 1,
      content:
        'Jpwav werfcv blyy dwnm bse znldkdmb knvih nqwbvewrx kveevrgb lpzjxvdl lepn foggqwu zbdwssx fcnjv.',
      avatar: 'http://dummyimage.com/48x48/79f2e3/757575.png&text=J',
      date: '2016-05-29 11:33:01',
    },
  ],
  recentSales: [
    {
      id: 1,
      name: 'Perez',
      status: 1,
      price: 110.45,
      date: '2015-08-06 10:13:30',
    },
    {
      id: 2,
      name: 'Brown',
      status: 3,
      price: 53.54,
      date: '2016-04-02 02:38:13',
    },
    {
      id: 3,
      name: 'Clark',
      status: 4,
      price: 139.78,
      date: '2016-06-20 10:36:35',
    },
    {
      id: 4,
      name: 'Garcia',
      status: 2,
      price: 62.94,
      date: '2015-09-02 03:44:09',
    },
    {
      id: 5,
      name: 'Gonzalez',
      status: 3,
      price: 22.4,
      date: '2015-08-02 12:34:09',
    },
    {
      id: 6,
      name: 'Clark',
      status: 1,
      price: 104.7,
      date: '2016-11-05 04:21:39',
    },
    {
      id: 7,
      name: 'Brown',
      status: 2,
      price: 94.74,
      date: '2016-07-15 21:22:15',
    },
    {
      id: 8,
      name: 'Johnson',
      status: 2,
      price: 19.83,
      date: '2016-01-24 18:56:31',
    },
    {
      id: 9,
      name: 'Allen',
      status: 2,
      price: 160.6,
      date: '2015-10-30 10:36:12',
    },
    {
      id: 10,
      name: 'Taylor',
      status: 3,
      price: 121.64,
      date: '2016-10-13 02:36:22',
    },
    {
      id: 11,
      name: 'Young',
      status: 4,
      price: 51.82,
      date: '2016-03-07 00:17:25',
    },
    {
      id: 12,
      name: 'Moore',
      status: 3,
      price: 27.3,
      date: '2016-05-15 16:31:26',
    },
    {
      id: 13,
      name: 'Harris',
      status: 4,
      price: 189.73,
      date: '2016-04-11 08:04:42',
    },
    {
      id: 14,
      name: 'Lee',
      status: 2,
      price: 141.7,
      date: '2015-12-17 09:05:00',
    },
    {
      id: 15,
      name: 'Martin',
      status: 2,
      price: 35.4,
      date: '2015-06-21 10:42:55',
    },
    {
      id: 16,
      name: 'Garcia',
      status: 1,
      price: 62.4,
      date: '2016-02-12 17:39:42',
    },
    {
      id: 17,
      name: 'Lopez',
      status: 3,
      price: 178.5,
      date: '2015-01-01 04:38:50',
    },
    {
      id: 18,
      name: 'Thomas',
      status: 2,
      price: 69.6,
      date: '2016-08-07 20:18:20',
    },
    {
      id: 19,
      name: 'Hall',
      status: 3,
      price: 164.51,
      date: '2016-02-09 23:31:15',
    },
    {
      id: 20,
      name: 'Brown',
      status: 2,
      price: 151.43,
      date: '2016-04-02 20:53:42',
    },
    {
      id: 21,
      name: 'Moore',
      status: 4,
      price: 34.4,
      date: '2016-03-17 16:53:24',
    },
    {
      id: 22,
      name: 'Garcia',
      status: 3,
      price: 80.8,
      date: '2016-12-27 20:09:40',
    },
    {
      id: 23,
      name: 'Miller',
      status: 1,
      price: 162.1,
      date: '2016-09-02 00:26:29',
    },
    {
      id: 24,
      name: 'Walker',
      status: 3,
      price: 76.2,
      date: '2015-05-28 04:51:32',
    },
    {
      id: 25,
      name: 'Robinson',
      status: 3,
      price: 24.4,
      date: '2016-06-08 11:36:47',
    },
    {
      id: 26,
      name: 'Allen',
      status: 4,
      price: 20.47,
      date: '2016-11-14 21:22:10',
    },
    {
      id: 27,
      name: 'Walker',
      status: 2,
      price: 86.7,
      date: '2015-04-06 15:22:02',
    },
    {
      id: 28,
      name: 'Young',
      status: 2,
      price: 41.2,
      date: '2016-12-12 05:13:35',
    },
    {
      id: 29,
      name: 'Rodriguez',
      status: 3,
      price: 169.37,
      date: '2015-03-24 07:13:10',
    },
    {
      id: 30,
      name: 'Rodriguez',
      status: 3,
      price: 106.54,
      date: '2016-02-01 09:12:30',
    },
    {
      id: 31,
      name: 'Jones',
      status: 1,
      price: 46.12,
      date: '2016-11-12 15:03:19',
    },
    {
      id: 32,
      name: 'Williams',
      status: 2,
      price: 167.4,
      date: '2015-08-21 18:31:51',
    },
    {
      id: 33,
      name: 'Brown',
      status: 4,
      price: 131.15,
      date: '2015-09-26 02:04:53',
    },
    {
      id: 34,
      name: 'Lewis',
      status: 3,
      price: 95.4,
      date: '2016-01-01 00:46:56',
    },
    {
      id: 35,
      name: 'Jackson',
      status: 2,
      price: 50.88,
      date: '2015-02-12 11:43:37',
    },
    {
      id: 36,
      name: 'Martin',
      status: 3,
      price: 175.68,
      date: '2015-05-12 15:28:48',
    },
  ],
  quote: {
    name: 'Joho Doe',
    title: 'Graphic Designer',
    content:
      'I am selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can not handle me at my worst, then you sure as hell do not deserve me at my best.',
    avatar:
      'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
  },
  numbers: [
    {
      icon: 'pay-circle-o',
      color: '#64ea91',
      title: 'Online Review',
      number: 2781,
    },
    { icon: 'team', color: '#8fc9fb', title: 'New Customers', number: 3241 },
    {
      icon: 'message',
      color: '#d897eb',
      title: 'Active Projects',
      number: 253,
    },
    {
      icon: 'shopping-cart',
      color: '#f69899',
      title: 'Referrals',
      number: 4324,
    },
  ],
}

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    sales: [],
    quote: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar:
        'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    list: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/dashboard', pathname) ||
          pathMatchRegexp('/', pathname)
        ) {
          dispatch({ type: 'query' })
          dispatch({ type: 'queryWeather' })
          dispatch({ type: 'querylog' })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = Dashboard
      yield put({
        type: 'updateState',
        payload: data,
      })
    },
    *queryWeather({ payload = {} }, { call, put }) {
      payload.location = 'shenzhen'
      const result = yield call(queryWeather, payload)
      const { success } = result
      if (success) {
        const data = result.results[0]
        const weather = {
          city: data.location.name,
          temperature: data.now.temperature,
          name: data.now.text,
          icon: `//s5.sencdn.com/web/icons/3d_50/${data.now.code}.png`,
        }
        yield put({
          type: 'updateState',
          payload: {
            weather,
          },
        })
      }
    },
    *querylog({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      let arg = {
        auditsListMaxCount: 5,
        auditProjectsMaxcount: 8,
      }
      const data = yield call(queryLog, arg, headers)
      console.log(data)

      if (data.success) {
        let recentProjects = data.list.auditsList.split('<br>')
        let recentOpen = []
        recentProjects.forEach(pro => {
          if (pro.length > 0) {
            recentOpen.push({
              name: pro,
              percent: 2.53,
              status: 1,
            })
          }
        })
        //,{projectActivies:}
        let onlineData = Object.assign(
          Dashboard,
          {
            user: {
              sales: data.list.projectsCreateCount,
              sold: data.list.projectsInvoleCount,
            },
          },
          { recentOpen: recentOpen },
          { recentOperate: data.list.latestEditProjects },
          { projectsActivitiesCount: data.list.projectsActivitiesCount }
        )
        // yield put({
        //   type:'getLogList',
        //   payload:data.list
        // })
        //auditsList
        yield put({
          type: 'updateState',
          payload: onlineData,
        })
      }
    },
  },
  reducers: {
    getLogList(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        list: payload,
      }
    },
  },
})
