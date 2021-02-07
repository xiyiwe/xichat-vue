import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login'
import Index from '../views/index/Index'
import FriendChat from "@/views/chat/FriendChat";
import GroupChat from "@/views/chat/GroupChat";
import Register from "@/views/regist/Register";
import AddStudent from "@/components/friend/AddStudent";
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
          path: '/friendChat',
          name: 'FriendChat',
          component: FriendChat
        },
        // {
        //   path: '/chat',
        //   name: 'chat',
        //   component: chat
        // },
        {
          path: '/addFriend',
          name: 'AddStudent',
          component: AddStudent
        },
        {
          path: '/addGroup',
          name: 'AddGroup',
          component: AddGroup
        },
        {
          path: '/groupChat',
          name: 'GroupChat',
          component: GroupChat
        }
        ]
    }
  ]
})
