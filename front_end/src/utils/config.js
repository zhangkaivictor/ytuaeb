module.exports = {
  siteName: 'Company Name',
  copyright: 'Copyright © 2019 All Company Corporation Limited',
  logoPath: '/logo-small.ico',
  // apiPrefix: 'http://40.121.23.71/backend', //saic
  apiPrefix: 'http://39.100.49.28/backend',
  expotApi: 'http://39.100.49.28:8081',
  fixedHeader: true, // sticky primary layout header
  leftPath: '/logoleft.png',

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/)*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'zh',
  },
}
