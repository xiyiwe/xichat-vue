<template>
  <el-container style="height: 700px; border: 1px solid #eee;flex-grow:1" >
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1', '2','3','4']">
        <el-submenu index="1">
          <template slot="title">好友菜单</template>
          <el-menu-item index="/addFriend">添加好友</el-menu-item>
          <el-submenu index="2">
            <template slot="title">好友列表</template>
<!--            <el-menu-item index="/friendChat" v-for="(item) in friendsList"  :key="item.userName" @click="pushFriendInfo(item.userAccount,item.userName)">-->
            <el-menu-item index="/friendChat/" v-for="(item) in friendsList"  :key="item.userName" @click="pushFriendInfo(item.userAccount,item.userName)">
              {{item.userName}}
              <span style="color: red" v-if="item.notReadMessageCount!=='0'">{{ item.notReadMessageCount }}</span>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">群聊菜单</template>
          <el-menu-item index="/addGroup">新建群聊</el-menu-item>
          <el-submenu index="4">
            <template slot="title">群聊列表</template>
            <el-menu-item index="/groupChat" v-for="(item) in groupList"  :key="item.groupName" @click="pushGroupInfo(item.groupId,item.groupName)">
              {{item.groupName}}
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
         <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
         </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>用户：{{user}}</span>
      </el-header>

      <el-main>
        <router-view @updateFriendListAndNotReadMessage="updateFriendListAndNotReadMessage"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  // groupList:[],
  data() {
    return {
      user:'',
      groupList:[],
      friendsList:[],
      notReadMessageCount:0,
      notReadPersonList:[]
  };
},
  methods:{
    // updateNotReadMessage(){
    //   const _this = this
    //   this.axios({
    //     url:'/friend/getNotReadMessageCountFromFriend'+,
    //     method: 'get',
    //     headers: {
    //       Authorization: sessionStorage.token
    //     }
    //   }).then(function (resp){
    //     _this.friendsList = resp.data
    //   })
    // },
    logout(){
      const _this = this
      this.axios({
        url: '/logout',
        method: 'get',
        headers: {
        Authorization: sessionStorage.token
      }
      // beforeSend : function(request) {
      //     request.setRequestHeader("Authorization", sessionStorage.token);
      //   }
      }).then(function () {
        sessionStorage.setItem("userName", "")
        sessionStorage.setItem("Authorization", "")
        // sessionStorage.setItem("currentUser","")
        _this.$router.push('/login')
      })
    },
    pushGroupInfo(groupId,groupName){
      this.$router.push(
          {path:'/groupChat',
            query:{
              currentGroupName:groupName,
              currentGroupId:groupId
          }
          })
    },
    pushFriendInfo(fUserAccount,fUserName){
      this.updateNotReadMessage(fUserAccount)
      this.updateFriendListAndNotReadMessage()
      // this.$forceUpdate()
      this.$router.push(
          {
            path:'/friendChat/'+fUserAccount,
            query:{
              currentFUserName:fUserName,
              currentFUserAccount:fUserAccount
            }
          }
      )
    },
    pushUpdateMethod(fUserAccount){
      this.updateNotReadMessage(fUserAccount)
      this.updateFriendListAndNotReadMessage()
    },
    updateNotReadMessage(fUserAccount){
      const _this = this
      _this.axios({
        url:'/friend/updateFriendNotReadMessage/'+fUserAccount,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      })
    },
    updateFriendListAndNotReadMessage(){
      const _this = this
      // console.log("调用了updateFriendListAndNotReadMessage")
      _this.axios({
        url:'/friend/getUserFriendsAndNotReadMessage',
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(resp=> {
        this.friendsList = resp.data
      })
    }
  },
  mounted() {
    const _this = this
    _this.user = sessionStorage.getItem("userName")
    // _this.updateFriendListAndNotReadMessage()
    _this.updateFriendListAndNotReadMessage()
    // this.axios({
    //   url:'/friend/getUserFriends',
    //   method: 'get',
    //   headers: {
    //     Authorization: sessionStorage.token
    //   }
    // }).then(function (resp){
    //   _this.friendsList = resp.data
    // })
    this.axios({
      url:'/group/getUserGroup',
      method: 'get',
      headers: {
        Authorization: sessionStorage.token
      }
    }).then(function (resp){
      _this.groupList = resp.data.allGroup
    })
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

