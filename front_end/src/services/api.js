const api = {
  queryUserInfo: '/user',
  queryDic: '/api/ShqDictionaries/all', //
  logoutUser: '/user/logout',
  loginUser: '/api/ShqUsers',
  token: 'POST /oauth2/token',

  queryUser: '/user/:id',
  queryUserList: '/api/ShqUsers/All',
  updateUser: 'PUT /api/ShqUsers/Update',
  createUser: 'POST /api/ShqUsers/Add',
  changePassword: 'PUT /api/ShqUsers/ChangePassword',

  queryPostList: '/api/Projects/All',
  queryPostTypeList: '/api/Projects',
  createPost: 'POST /api/Projects/Add',
  deletePost:'DELETE api/Projects/Delete',

  // createPostFtaMap:'POST /api/FTAProjects/test',
  createPostFtaMap: 'POST /api/FTAProjects/AddTree',
  getFtaMap: '/api/FTAProjects/GetTree',
  getAnalyzeTree: 'POST /api/FTAProjects/AnalyzeTree',
  getTreeReport: '/api/FTAProjects/GetTreeReport',

  queryDashboard: '/dashboard',
  //FMEA
  getFmeaData: '/api/FMEAProjects/GetTree',
  postFmeaData: 'POST /api/FMEAProjects/AddTree',
  remotePrecaution:'/api/ShqKeywordSets/Search',
  //vars
  getProjectContent: '/api/WorkProjects/GetWorkProject',
  queryOriginProject: '/api/ProjectFiles',
  linkProject: 'GET /api/WorkProjects/AddLinkedProject',
  unLinkProject: 'GET /api/WorkProjects/RemoveLinkedProject',
  updateFile: 'POST /api/ProjectFiles/Update',
}

export default api
