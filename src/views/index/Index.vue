<template>
  <el-container style="height: 700px; border: 1px solid #eee;flex-grow:1" >
    <el-aside width="250px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1', '2','3','4','5']">
        <el-submenu index="1">
          <template slot="title">好友菜单</template>
          <el-menu-item index="/addFriend">添加好友</el-menu-item>
          <el-submenu index="2">
            <template slot="title">好友列表</template>
<!--            <el-menu-item index="/friendChat" v-for="(item) in friendsList"  :key="item.userName" @click="pushFriendInfo(item.userAccount,item.userName)">-->
            <el-menu-item index="/friendChat/" v-for="(item) in friendsList"  :key="item.userName" @click="pushFriendInfo(item.userAccount,item.userName,item.userImg)">

              <img style="float: left" class="userImg" :src="item.userImg">
              <span>{{item.userName}}</span>
              <span style="color: red" v-if="item.notReadMessageCount!=='0'">未读:{{ item.notReadMessageCount }}</span>
              <span style="color: black" >{{ item.state | onlineState}}</span>
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
        <el-submenu index="5">
          <template slot="title">个人中心</template>
          <el-menu-item index="/user/updateUser">修改个人资料</el-menu-item>
          <el-menu-item index="/user/notify">请求通知</el-menu-item>
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
        <img class="userImg" :src="userImg">
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
      userImg:'',
      currentFUserAccount:'',
      groupList:[],
      friendsList:[],
      // notReadMessageCount:0,
      notReadPersonList:[],
      notReadGroupList:[]
  };
},
  filters:{
    onlineState(state){
        if(state==='1'){
          return '在线'
        }else{
          return '不在线'
        }
    }
  },
  methods:{
    // getFUserImgs(userAccount){
    //   const _this = this
    //   this.axios({
    //     url: '/friend/getFUserImgs/'+userAccount,
    //     method: 'get',
    //     headers: {
    //       Authorization: sessionStorage.token
    //     }
    //   }).then(function (resp){
    //     _this.groupList = resp.data
    //   })
    // },
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
        sessionStorage.setItem('userAccount',"")
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
    pushFriendInfo(fUserAccount,fUserName,fUserImg){
        this.$router.push(
            {
              path:'/friendChat/'+fUserAccount,
              query:{
                currentFUserName:fUserName,
                currentFUserAccount:fUserAccount,
                currentFUserImg:fUserImg
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
    //查询所有好友发来的未读消息数量和好友信息和在线状态
    updateFriendListAndNotReadMessage(){
      const _this = this
      _this.axios({
        url:'/friend/getUserFriendsAndNotReadMessage',
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(resp=> {
        _this.friendsList = resp.data
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
    if(sessionStorage.getItem("token")===null){
      this.$router.push(
          {
            path:'/',
          }
      )
    }
    const _this = this
    _this.user = sessionStorage.getItem("userName")
    _this.userImg = sessionStorage.getItem("userImg")
    _this.updateFriendListAndNotReadMessage()
    _this.updateGroupListAndNotReadMessage()

  },
  beforeDestroy() {
    // this.onlineStatus='不在线'
    this.wsObj.onclose=(evt)=>{
      console.log(evt)
    }
    this.wsObj.close(this.userAccount)
  },
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.userImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
/*.el-aside {*/
/*  color: #333;*/
/*}*/
</style>

