import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pluginAxios from './plugins/axios';
import pluginModal from './plugins/modal';

import '@/assets/style/common.sass';

createApp(App)
  .use(router)
  .use(pluginAxios)
  .use(pluginModal)
  .mount('#app');
