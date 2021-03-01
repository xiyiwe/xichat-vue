import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/Login'
import Index from '../views/index/Index'
import FriendChat from "@/views/chat/FriendChat";
import GroupChat from "@/views/chat/GroupChat";
import Register from "@/views/regist/Register";
import AddFriend from "@/components/friend/AddFriend";
import AddGroup from "@/components/group/AddGroup";
import JoinGroup from "@/components/group/JoinGroup";
import UpdateUser from "@/components/User/UpdateUser";
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
          path: '/friendChat/:fUserAccount',
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
          name: 'AddFriend',
          component: AddFriend
        },
        {
          path: '/updateUser',
          name: 'UpdateUser',
          component: UpdateUser
        },
        {
          path: '/addGroup',
          name: 'AddGroup',
          component: AddGroup
        },
        {
          path: '/joinGroup',
          name: 'JoinGroup',
          component: JoinGroup
        },
        {
          path: '/groupChat/:groupId',
          name: 'GroupChat',
          component: GroupChat
        }
        ]
    }
  ]
})
