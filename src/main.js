import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 按需引入element-ui
import { Button } from 'element-ui';

Vue.use(Button)


// 引入axois
import axios from 'axios'

Vue.prototype.axios = axios
axios.defaults.baseURL = ''


Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
