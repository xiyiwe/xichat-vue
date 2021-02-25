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
              <el-dropdown>
                 <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                 </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="deleteFriend(item.userAccount)">删除好友</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">群聊菜单</template>
          <el-menu-item index="/addGroup">新建群聊</el-menu-item>
          <el-menu-item index="/joinGroup">加入群聊</el-menu-item>
          <el-submenu index="4">
            <template slot="title">群聊列表</template>
            <el-menu-item index="/groupChat" v-for="(item) in groupList"  :key="item.groupName" @click="pushGroupInfo(item.groupId,item.groupName)">
              {{item.groupName}}
              <span style="color: red" v-if="item.notReadMessageCount!=='0'">{{ item.notReadMessageCount }}</span>
              <el-dropdown>
                 <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                 </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="deleteGroup(item.groupId)">退出群组</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
        <router-view @updateFriendListAndNotReadMessage="updateFriendListAndNotReadMessage"
        @updateGroupListAndNotReadMessage="updateGroupListAndNotReadMessage"
        @updateGroupNotReadMessage="updateGroupNotReadMessage"
        @@updateNotReadMessage="updateNotReadMessage" >

        </router-view>
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
      currentFUserAccount:'',
      groupList:[],
      friendsList:[],
      // notReadMessageCount:0,
      notReadPersonList:[],
      notReadGroupList:[]
  };
},
  methods:{
    deleteFriend(fUserAccount){
      const _this = this
      this.axios({
            url: '/friend/deleteFriend/'+fUserAccount,
            method: 'get',
            headers: {
              Authorization: sessionStorage.token
            }
    }).then(function () {
        _this.updateFriendListAndNotReadMessage()
      })
    },
    deleteGroup(groupId){
      const _this = this
      this.axios({
        url: '/group/quitGroup/'+groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function () {
        _this.updateGroupListAndNotReadMessage()
      })
    },
    logout(){
      const _this = this
      this.axios({
        url: '/logout',
        method: 'get',
        headers: {
        Authorization: sessionStorage.token
      }
      }).then(function () {
        sessionStorage.setItem("userName", "")
        sessionStorage.setItem("Authorization", "")
        // sessionStorage.setItem("currentUser","")
        _this.$router.push('/login')
      })
    },
    pushGroupInfo(groupId,groupName){
      this.$router.push(
          {
            path:'/groupChat/'+groupId,
            query:{
              currentGroupName:groupName,
              currentGroupId:groupId
          }
          })
    },
    //点击左侧好友
    pushFriendInfo(fUserAccount,fUserName){
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
    //更新单个好友左侧未读信息数量
    updateNotReadMessage(fUserAccount){
      console.log("调用了updateNotReadMessage")
      const _this = this
      _this.axios({
        url:'/friend/updateFriendNotReadMessage/'+fUserAccount,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      })
    },
    //查询所有好友发来的未读消息数量和好友信息
    updateFriendListAndNotReadMessage(){
      const _this = this
      _this.axios({
        url:'/friend/getUserFriendsAndNotReadMessage',
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(resp=> {
        this.friendsList = resp.data
      })
    },
    //查询所有群组发来的未读消息数量和群组信息
    updateGroupListAndNotReadMessage(){
      const _this = this
      this.axios({
        url:'/group/getUserGroupsAndNotReadMessageCount',
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (resp){
        _this.groupList = resp.data
      })
    },
    //更新单个群组左侧未读信息数量
    updateGroupNotReadMessage(groupId){
      console.log("updateGroupNotReadMessage")
      const _this = this
      _this.axios({
        url:'/group/updateGroupNotReadMessage/'+groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      })
    },
  },
  mounted() {
    const _this = this
    _this.user = sessionStorage.getItem("userName")
    _this.updateFriendListAndNotReadMessage()
    _this.updateGroupListAndNotReadMessage()

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

