import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login'
import Index from '../views/index/Index'
import FriendChat from "@/views/chat/FriendChat";
import Register from "@/views/regist/Register";
import AddStudent from "@/components/friend/AddStudent";
import Chat from "@/components/chat/Chat";
import AddGroup from "@/components/group/AddGroup";
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
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/friendchat',
          name: 'FriendChat',
          component: FriendChat
        },
        {
          path: '/addfriend',
          name: 'AddStudent',
          component: AddStudent
        },
        {
          path: '/chat',
          name: 'Chat',
          component: Chat
        },
        {
          path: '/addgroup',
          name: 'AddGroup',
          component: AddGroup
        }
        ]
    }
  ]
})
