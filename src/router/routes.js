import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
    {
      path: '/',
      redirect:{
          name:'Login'
      }
    },
    {
        path:'/home',
        name: 'Home',
        component: Home,
        redirect:{
          name:'Welcome'
        },
        // 子路由
        children:[
          {
            name:'Welcome',
            path:'welcome',
            component: () => import('../components/Welcome.vue')
          },
          {
            name:'Users',
            path:'users',
            component:()=> import('../components/user/Users.vue')
          },
          {
            name:'Right',
            path:'rights',
            component:()=>import('../components/right/Rights.vue')
          },
          {
            name:'Role',
            path:'roles',
            component:()=>import('../components/right/Roles.vue')
          }
        ]
    },
    {
        name:'Login',
        path:'/login',
        component:Login
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
  export default routes
  