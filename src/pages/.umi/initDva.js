import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});
app.use(require('../../plugins/onError.js').default);
app.use(require('C:/Users/zwang46/Desktop/saic-Safety analysis/node_modules/.0.2.4@dva-immer/lib/index.js').default());
app.model({ namespace: 'app', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/models/app.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/pages/dashboard/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/pages/login/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/pages/post/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/pages/project/FTA/$id/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/zwang46/Desktop/saic-Safety analysis/src/pages/user/model.js').default) });
