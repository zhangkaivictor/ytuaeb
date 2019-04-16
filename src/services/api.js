const api = {
  queryUserInfo: '/user',
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
  updatePost: 'PUT /api/Projects/Update',

  // createPostFtaMap:'POST /api/FTAProjects/test',
  createPostFtaMap:'POST /api/FTAProjects/AddTree',
  getFtaMap:'/api/FTAProjects/GetTree',
  getAnalyzeTree:'POST /api/FTAProjects/AnalyzeTree',


  queryDashboard: '/dashboard',
}

export default api