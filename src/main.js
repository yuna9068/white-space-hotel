import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './plugins/axios';

import '@/assets/style/common.sass';

createApp(App).use(router).use(axios).mount('#app');
