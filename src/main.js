import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import BreadcrumbHeader from './components/BreadcrumbHeader.vue'

// 全局样式
import './assets/css/common.css'

// 按需引入element-ui
import './plugins/element.js'

// 引入axois
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

// 请求拦截器，token认证
axios.interceptors.request.use( config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios

// 注册全局组件
Vue.component('breadcrumb-header',BreadcrumbHeader)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
