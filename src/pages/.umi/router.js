import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: "layouts__index" */'../../layouts/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default }),
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__404" */'../404.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/404",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__404" */'../404.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__index" */'../index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__index" */'../index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/dashboard",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__dashboard__index" */'../dashboard/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/dashboard",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__dashboard__index" */'../dashboard/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/login",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__login__index" */'../login/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/login",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__login__index" */'../login/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/post",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__post__index" */'../post/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/post",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__post__index" */'../post/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/project/FMEA",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FMEA__index" */'../project/FMEA/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/project/FMEA",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FMEA__index" */'../project/FMEA/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/project/FMEA/:id",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FMEA__$id__index" */'../project/FMEA/$id/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/project/FMEA/:id",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FMEA__$id__index" */'../project/FMEA/$id/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/project/FTA/:id",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FTA__$id__index" */'../project/FTA/$id/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/project/FTA/:id",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__FTA__$id__index" */'../project/FTA/$id/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/project/vars",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__vars__index" */'../project/vars/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/project/vars",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__project__vars__index" */'../project/vars/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/request",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__request__index" */'../request/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/request",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__request__index" */'../request/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/UIElement/editor",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__UIElement__editor__index" */'../UIElement/editor/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/UIElement/editor",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__UIElement__editor__index" */'../UIElement/editor/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/user",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__user__index" */'../user/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "path": "/:lang(en|zh)/user",
        "exact": true,
        "component": dynamic({ loader: () => import(/* webpackChunkName: "p__user__index" */'../user/index.js'), loading: require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/components/Loader/Loader').default })
      },
      {
        "component": () => React.createElement(require('c:/Users/wanzhiyo/AppData/Roaming/npm/node_modules/umi/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
      }
    ]
  },
  {
    "component": () => React.createElement(require('c:/Users/wanzhiyo/AppData/Roaming/npm/node_modules/umi/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
