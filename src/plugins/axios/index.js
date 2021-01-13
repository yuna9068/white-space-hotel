import axios from 'axios';

const pluginAxios = {
  install(app) {
    /* eslint-disable no-param-reassign */
    app.config.globalProperties.$axios = axios;
    /* eslint-disable no-param-reassign */

    axios.defaults.baseURL = 'https://challenge.thef2e.com/api/thef2e2019/stage6/';
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.common.Accept = 'application/json';

    const token = 'V8AmnnzkrsFuXarQiVFv8ZAr5RXl6JgBnjn1GweP9wb7vbyxiRkWJGjPq4ut';
    axios.defaults.headers.Authorization = `Bearer ${token}`;

    axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
    // axios.interceptors.request.use((config) => {
    //   console.log('=== axios/index.js request ===');
    //   console.log(config);
    //   return config;
    // }, (error) => {
    //   console.log('request error: ', error);
    //   return Promise.reject(error);
    // });

    axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));
    // axios.interceptors.response.use((response) => {
    //   console.log('=== axios.interceptors.response ===');
    //   console.log(response);
    //   return response;
    // }, (error) => {
    //   console.log('response error: ', error);
    //   return Promise.reject(error);
    // });
  },
};

export default pluginAxios;
