import { router, pathMatchRegexp } from 'utils'
import { loginUser, token } from 'api'

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      window.localStorage.setItem('username',payload.username);
      const data = 'username=' + payload.username + '&password='+ payload.password +'&grant_type=password';
      const headers = {
        'Accept':'application/json',
        'Content-Type':'application/x-www-form-urlencoded'
      };
      const login = yield call(token, data, headers);

      if(login.success){
        let access_key = login.list.token_type+ ' '+ login.list.access_token;
        window.localStorage.setItem('token',access_key);
        let headers = {
          'Authorization': access_key,
          'contentType': 'application/json'
        }
        const shqUser = yield call(loginUser, {'email':payload.username}, headers)
        // window.localStorage.setItem('username',payload.username);
        //const { locationQuery } = yield select(_ => _.app)
        if (shqUser.success && shqUser.list.status == 1) {
          //const { from } = locationQuery
          yield put({ type: 'app/query'})
          //if (!pathMatchRegexp('/login', from)) {
            //if (from === '/') router.push('/dashboard')
           // else router.push(from)
          //} else {
          //   router.push('/dashboard')
          //}
        } else {
          if(shqUser.list.status == 2){
            throw "当前账户为冻结状态"
          }else {
            throw shqUser
          }
        }
      }else {
        throw login;
      }
    },
  },
}
