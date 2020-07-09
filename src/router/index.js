import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 登录权限控制
router.beforeEach((to,from,next) => {
  console.log(to)
  // 直接访问登录页面
  if(to.path == '/login')
    return next()

  // 访问其他页面
    let token = window.sessionStorage.getItem('token')
    // 如果没有token
    if(!token)
      return next('/login')
    // 有token 
    next()
})

export default router
