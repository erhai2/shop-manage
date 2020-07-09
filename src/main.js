import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局样式
import './assets/common.css'

// 按需引入element-ui
import './plugins/element.js'

// 引入axois
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.prototype.$axios = axios


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
