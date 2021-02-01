<template>
  <el-container style="height: 1000px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1', '4']">
        <el-submenu index="1">
          <template slot="title">好友菜单</template>
          <el-menu-item index="/addFriend">添加好友</el-menu-item>
          <el-submenu index="2">
            <template slot="title">好友列表</template>
            <el-menu-item index="/chat" v-for="(item) in friendsList"  :key="item.userName">
              {{item.userName}}
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">群聊菜单</template>
          <el-menu-item index="/addGroup">新建群聊</el-menu-item>
          <el-submenu index="4">
            <template slot="title">群聊列表</template>
            <el-menu-item index="/selectAllTeacher">群聊列表</el-menu-item>
          </el-submenu>
        </el-submenu>
<!--        <el-submenu index="3">-->
<!--          <template slot="title">课程管理</template>-->
<!--          <el-menu-item index="/selectAllCourse">课程管理</el-menu-item>-->
<!--          <el-menu-item index="/editCurrentTerm">修改当前学期</el-menu-item>-->
<!--        </el-submenu>-->
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  user: '',
  data() {
    return {
      friendsList:[],
  };
},
  methods:{
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
    }
  },
  beforeCreate() {
    const _this = this
    this.user = sessionStorage.getItem("userName")
    // if(sessionStorage.getItem("token")===null)
    // {
    //   this.$router.push('/login')
    // }
    this.axios({
      url:'/friend/getUserFriends',
      method: 'get',
      headers: {
        Authorization: sessionStorage.token
      }
    }).then(function (resp){
      console.log(resp)
      // this.friendsList=resp.data
      _this.friendsList = resp.data
      console.log(_this.friendsList[0].userName)
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

