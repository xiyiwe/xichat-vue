import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login'
import Index from '../views/index/Index'
import FriendChat from "@/views/chat/FriendChat";
import Register from "@/views/regist/Register";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/FriendChat',
      name: 'FriendChat',
      component: FriendChat
    },
  ]
})
