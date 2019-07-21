module.exports = {
  siteName: 'SAIC MOTOR',
  copyright: 'Copyright © 2018 SAIC Motor Corporation Limited',
  logoPath: '/logo-small.ico',
  // apiPrefix: 'http://40.121.23.71/backend', 
  apiPrefix: 'http://39.100.49.28/backend/',
  fixedHeader: true, // sticky primary layout header

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
