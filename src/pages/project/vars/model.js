import modelExtend from 'dva-model-extend'
import { getProjectContent, linkProject, unLinkProject, updateFile } from 'api'
import { pathMatchRegexp, router } from 'utils'
import { apiPrefix } from 'utils/config'
import { pageModel } from 'utils/model'
import { message } from 'antd'
// import { st} from
export default modelExtend(pageModel, {
  namespace: 'VARS',
  state: {
    projectContent: null,
    activeNode: null,
    selectForAdd: [],
    fileList: [],
    uploading: false,
    spin: false,
    spinText: 'loading',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/project/VARS', location.pathname)) {
          if (location.query.projectId != undefined) {
            dispatch({
              type: 'getWorkProjectContent',
              payload: {
                projectId: location.query.projectId,
              },
            })
          } else {
            router.push({
              pathname: '/post',
            })
            message.info('目前没有项目，请新建！！！')
          }
        }
      })
    },
  },
  effects: {
    *getWorkProjectContent({ payload = {} }, { call, put }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const data = yield call(getProjectContent, payload, headers)
      if (data.success) {
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
      }
    },
    *addProjectLink({ payload = {} }, { call, put, select }) {
      const projects = yield select(state => state.VARS.selectForAdd)
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      let data = null
      for (let i = 0; i < projects.length; i++) {
        let payload = {
          linkedProjectId: projects[i],
          workProjectId: workProjectId,
        }
        data = yield call(linkProject, payload, headers)
      }
      if (data.success) {
        message.success('绑定成功')
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
        //更新files
        let node = yield select(state => state.VARS.activeNode)
        yield put({
          type: 'selectTreeNode',
          payload: {
            type: node.type,
            files:
              node.type == 'fmea'
                ? data.list.fmeaProjects
                : data.list.ftaProjects,
          },
        })
      }
    },
    *unBindProject({ payload = {} }, { call, put, select }) {
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      let dd = {
        linkedProjectId: payload.id,
        workProjectId: workProjectId,
      }
      const data = yield call(unLinkProject, dd, headers)
      if (data.success) {
        message.success('解绑成功')
        yield put({
          type: 'projectContent',
          payload: {
            list: data.list,
          },
        })
        //更新files
        let node = yield select(state => state.VARS.activeNode)
        yield put({
          type: 'selectTreeNode',
          payload: {
            type: node.type,
            files:
              node.type == 'fmea'
                ? data.list.fmeaProjects
                : data.list.ftaProjects,
          },
        })
      }
    },
    *updateFile({ payload = {}, callback }, { call, put, select }) {
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      const node = yield select(state => state.VARS.activeNode)
      yield put({
        type: 'spin',
        payload: {
          status: true,
          text: 'uploading',
        },
      })
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      let result = null
      for (let i = 0; i < payload.length; i++) {
        payload[i].ProjectId = workProjectId
        payload[i].TartgetPath = node.path
        result = yield call(updateFile, payload[i], headers)
      }
      yield put({
        type: 'spin',
        payload: {
          status: false,
          text: 'Please wait',
        },
      })
      let data = null
      if (result.success) {
        if (callback && typeof (callback === 'function')) {
          callback('success')
        }
        data = yield call(
          getProjectContent,
          { projectId: workProjectId },
          headers
        )
        if (data.success) {
          // yield put({
          //   type: 'projectContent',
          //   payload: {
          //     list: data.list,
          //   },
          // })
          const activeFolder = data.list.projectFiles.subFolders.find(
            folder => folder.id == node.id
          )
          yield put({
            type: 'selectTreeNode',
            payload: {
              ...node,
              files: activeFolder.files,
            },
          })
        }
      } else {
        if (callback && typeof (callback === 'function')) {
          callback('fail')
        }
      }
    },
    *download({ payload = {}, callback }, { call, put, select }) {
      yield put({
        type: 'spin',
        payload: {
          status: true,
          text: 'downloading',
        },
      })
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      let inputdata = {}
      inputdata.Id = payload.id
      inputdata.ProjectId = workProjectId
      inputdata.TartgetPath = payload.path
      inputdata.Name = payload.name
      inputdata.cmd = 'dowloadFile'
      let result = yield downloadPrjectFile(inputdata)
      yield put({
        type: 'spin',
        payload: {
          status: false,
          text: 'Please Wait',
        },
      })
      if (result == 'success') {
        if (callback && typeof (callback === 'function')) {
          callback('success')
        }
        let data = null
        const workProjectId = yield select(
          state => state.VARS.projectContent.id
        )
        data = yield call(
          getProjectContent,
          { projectId: workProjectId },
          headers
        )
        if (data.success) {
          let node = yield select(state => state.VARS.activeNode)
          const activeFolder = data.list.projectFiles.subFolders.find(
            folder => folder.id == node.id
          )
          yield put({
            type: 'selectTreeNode',
            payload: {
              ...node,
              files: activeFolder.files,
            },
          })
        }
      } else {
        if (callback && typeof (callback === 'function')) {
          callback('fail')
        }
      }
    },
    *delete({ payload = {}, callback }, { call, put, select }) {
      yield put({
        type: 'spin',
        payload: {
          status: true,
          text: 'deleting',
        },
      })
      const workProjectId = yield select(state => state.VARS.projectContent.id)
      let inputdata = {}
      inputdata.Id = payload.id
      inputdata.ProjectId = workProjectId
      inputdata.TartgetPath = payload.path
      inputdata.Name = payload.name
      inputdata.cmd = 'delete'
      const headers = {
        Authorization: window.localStorage.getItem('token'),
      }
      let result = yield call(updateFile, inputdata, headers)
      yield put({
        type: 'spin',
        payload: {
          status: false,
          text: 'Please wait',
        },
      })
      if (result.success) {
        if (callback && typeof (callback === 'function')) {
          callback('success')
        }
        let data = null
        const workProjectId = yield select(
          state => state.VARS.projectContent.id
        )
        data = yield call(
          getProjectContent,
          { projectId: workProjectId },
          headers
        )
        if (data.success) {
          let node = yield select(state => state.VARS.activeNode)
          const activeFolder = data.list.projectFiles.subFolders.find(
            folder => folder.id == node.id
          )
          yield put({
            type: 'selectTreeNode',
            payload: {
              ...node,
              files: activeFolder.files,
            },
          })
        }
      } else {
        if (callback && typeof (callback === 'function')) {
          callback('fail')
        }
      }
    },
  },
  reducers: {
    projectContent(state, { payload }) {
      return {
        ...state,
        projectContent: payload.list,
      }
    },
    selectTreeNode(state, { payload }) {
      console.log(payload)
      return {
        ...state,
        selectForAdd: [],
        activeNode: payload,
      }
    },
    addProject(state, { payload }) {
      return {
        ...state,
        selectForAdd: payload.projects,
      }
    },
    spin(state, { payload }) {
      return {
        ...state,
        spin: payload.status,
        spinText: payload.text,
      }
    },
  },
})
const downloadPrjectFile = (inputdata, token) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', apiPrefix + '/api/ProjectFiles/Update', true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function() {
      if (this.status === 200) {
        var filename = inputdata.Name
        /*
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }*/
        var type = xhr.getResponseHeader('Content-Type')
        var blob =
          typeof File === 'function'
            ? new File([this.response], filename, { type: type })
            : new Blob([this.response], { type: type })
        blob = new Blob([this.response], { type: type })
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename)
        } else {
          var URL = window.URL || window.webkitURL
          var downloadUrl = URL.createObjectURL(blob)

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement('a')
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
              window.location = downloadUrl
            } else {
              a.href = downloadUrl
              a.download = filename
              document.body.appendChild(a)
              a.click()
            }
          } else {
            window.location = downloadUrl
          }
          setTimeout(function() {
            URL.revokeObjectURL(downloadUrl)
            resolve('success')
          }, 100) // cleanup
        }
      } else {
        reject('download error')
      }
    }
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))
    xhr.send(JSON.stringify(inputdata))
  })
}
