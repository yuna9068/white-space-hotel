import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@/assets/style/common.sass';

createApp(App)
  .use(router)
  .mount('#app');
