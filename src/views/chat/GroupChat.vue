<template>
  <div>
    <el-container>
      <el-header>
        <p >
          当前聊天群:{{this.$route.query.currentGroupName}}
          群号：{{this.$route.query.currentGroupId}}
        </p>
      </el-header>
      <el-container>
        <!--        <el-aside ></el-aside>-->
        <el-container>
          <el-main style="height:400px;flex-grow:1;">
            <el-scrollbar >
              <div class="chat-content" >
                <div>
<!--                  <el-image-->
<!--                      style="width: 100px; height: 100px"-->
<!--                      src="/favicon.ico"-->
<!--                  ></el-image>-->
                </div>
                <!-- recordContent 聊天记录数组-->
                <div v-for="(messages,index) in messageList" :key="index" >
                  <!-- 对方 -->
                  <div class="word" v-if="userAccount!==messages.senderAccount">
                    <img class="userImg"  :src="allGroupMemberUserImg[messages.senderAccount]">
                    <!--                  <img :src="messages.fileUrl">-->
                    <div class="info">
                      <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                      <p v-if="messages.messageContent!=='ZOUc5BHlTVGd1Z/jc4HU9Q=='" class="info-content">{{messages.messageContent | decryptMessage}}</p>
                      <a v-if="messages.fileType==='file'" target="_blank" v-bind:href="messages.fileUrl | decryptMessage">{{messages.fileName}}</a>
                      <img class="fileImg" v-if="messages.fileType==='image'" :src="messages.fileUrl | decryptMessage" >
                    </div>
                  </div>
                  <!-- 我的 -->
                  <div class="word-my" v-else>
                    <div class="info-my">
                      <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                      <div v-if="messages.messageContent!=='ZOUc5BHlTVGd1Z/jc4HU9Q=='" class="info-content-my">{{messages.messageContent | decryptMessage}}</div>
                      <a v-if="messages.fileType==='file'" target="_blank" v-bind:href="messages.fileUrl | decryptMessage">{{messages.fileName}}</a>
                      <img class="fileImg" v-if="messages.fileType==='image'" :src="messages.fileUrl | decryptMessage" >
                    </div>
                    <img class="userImg"  :src="allGroupMemberUserImg[userAccount]">
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <div>
              <el-drawer
                  title="历史记录"
                  :visible.sync="messageHistoryDrawer"
                  :direction="direction">
                <!--                    :before-close="handleClose"-->

                <el-scrollbar style="height:70%">
                  <div class="chat-content" >

                    <!-- recordContent 聊天记录数组-->
                    <div v-for="(messages,index) in historyMessageList" :key="index" >
                      <!-- 对方 -->
                      <div class="word" v-if="userAccount!==messages.senderAccount">
                        <img class="userImg"  :src="allGroupMemberUserImg[messages.senderAccount]" alt="未上传头像">
                        <!--                          <img v-if="messages.fileUrl!=null && messages.fileUrl!==''" :src="messages.fileUrl" :onerror="imgDemo">-->
                        <div class="info">
                          <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                          <p v-if="messages.messageContent!=='ZOUc5BHlTVGd1Z/jc4HU9Q=='" class="info-content">{{messages.messageContent | decryptMessage}}</p>
                          <a v-if="messages.fileType==='file'" target="_blank" v-bind:href="messages.fileUrl | decryptMessage">{{messages.fileName}}</a>
                          <img class="fileImg" v-if="messages.fileType==='image'" :src="messages.fileUrl | decryptMessage" >
                        </div>
                      </div>
                      <!-- 我的 -->
                      <div class="word-my" v-else>
                        <div class="info-my">
                          <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                          <p v-if="messages.messageContent!=='ZOUc5BHlTVGd1Z/jc4HU9Q=='" class="info-content-my">{{messages.messageContent | decryptMessage}}</p>
                          <a v-if="messages.fileType==='file'" target="_blank" v-bind:href="messages.fileUrl | decryptMessage">{{messages.fileName}}</a>
                          <img class="fileImg" v-if="messages.fileType==='image'" :src="messages.fileUrl | decryptMessage" >
                        </div>
                        <img class="userImg"  :src="allGroupMemberUserImg[userAccount]">
                      </div>
                    </div>
                    <el-pagination
                        @current-change="getHistoryMessageByPage"
                        :current-page="historyCurrentPage"
                        :page-size="10"
                        multiple
                        :total="historyMessageCount">
                    </el-pagination>
                  </div>
                </el-scrollbar>
              </el-drawer>
            </div>
<!--            查看所有人员-->
            <div>
              <el-drawer
                  title="群内所有人员"
                  :visible.sync="groupMembersDrawer"
                  :direction="direction">

                <el-scrollbar style="height:70%">
                  <div v-for="(groupMember,index) in groupMembers" :key="index" >
                    <p>
                      <img alt="未上传头像" class="userImg"  :src="groupMember.userImg">
                      账号:{{groupMember.userAccount}},用户名:{{groupMember.userName}},状态:{{groupMember.state | onlineState}}</p>
                  </div>

                </el-scrollbar>
              </el-drawer>
            </div>
          </el-main>
          <el-footer>
            <div>
              <el-input type="text" placeholder="请输入消息" maxlength="40" v-model="sendMessage" style="width: 50%"/>
              <el-button type="primary"  @click="sendMessageBySocket()" >发送消息</el-button>
              <el-button @click="messageHistoryDrawer = true;getHistoryMessageByPage(1)" type="primary" style="margin-top: 10px;float: right" >
                历史记录
              </el-button>
              <el-button @click="groupMembersDrawer = true;getGroupMembers()" type="primary" style="margin-top: 10px;float: right" >
                查看群内人员
              </el-button>
            </div>
            <div>
              <input type="file"  value="选择文件" @change="getFile($event)">
              <!--                <input type="submit" value="表单提交">-->
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
              <span>{{uploadReturnMessage}}</span>
              <!--              </el-form>-->
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>

  </div>

</template>

<script>
import {formatDate} from "@/utils/formatDate";
import cryptoAES from "@/utils/js/cryptoAES";

export default {
  name: "GroupChat",
  data() {
    return {
      // imgDemo:require('C:\\zyz\\biyesheji\\xichat\\xichat-vue\\xichat-vue\\src\\static\\logo.png'),
      // actionUrl:'D:\\itemRepository\\gitRepository\\xichat-vue\\src\\files\\',
      groupMembers:[],
      allGroupMemberUserImg:'',
      fileList:[],
      historyMessageCount:0,
      historyCurrentPage:1,
      groupMembersDrawer:false,
      messageHistoryDrawer:false,
      direction: 'rtl',
      historyMessageList:[],
      messageList:[],
      groupId:'',
      groupName:'',
      sendMessage:'',
      sendMessageInfo:{
        sendMessage:'',
        senderAccount:'',
        senderName:'',
        receiverAccount:'',
        receiverName:'',
        fileUrl:'',
        fileName:'',
        fileType:'',
        isGroup:'1',
        groupId:'',
      },

      uploadReturnMessage:'',
      uploadFile:'',
      sendMessageInfoString:'',
      openMessage:'',
      closeMessage:'',
      errorMessage:'',
      userAccount: '',
      userName:'',
      wsUri :'' ,
      wsObj: ''
    }
  },
  filters:{
    onlineState(state){
      if(state==='1'){
        return '在线'
      }else{
        return '不在线'
      }
    },
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
    },
    decryptMessage(message){
      return cryptoAES.decrypt(message)
    }
  },
  methods:{
    // 加密
    encrypt (word) {
      return cryptoAES.encrypt(word)
    },
    // 解密
    decrypt (word) {
      return cryptoAES.decrypt(word)
    },
    openFile(eve){
      window.open(eve)
    },
    getFile(event){
      var file = event.target.files;
      // this.uploadFile=file[0]
      for(var i = 0;i<file.length;i++){
        //    上传类型判断
        this.uploadFile=file[0]
        if(file[i].size>=10485760){
          this.uploadReturnMessage = "文件过大"
          return false
        }
        var imgName = file[i].name;
        var idx = imgName.lastIndexOf(".");
        if (idx != -1){
          var ext = imgName.substr(idx+1).toUpperCase();
          ext = ext.toLowerCase( );
          if (ext!='pdf' && ext!='doc' && ext!='docx' && ext!='png' &&ext!='mp4'){
            this.uploadReturnMessage = "文件格式不规范"
            return false
          }else if(this.uploadFile.name.indexOf("%") !== -1){
            this.uploadReturnMessage = "文件名不能含有%"
            return false
          }else{
            this.fileList.push(file[i]);
          }
        }
      }
    },

    submitUpload(){
      if(this.fileList.length===0){
        this.uploadReturnMessage = "请先选择文件"
        return
      }
      const _this = this
      this.sendMessageInfo.senderAccount = this.userAccount
      this.sendMessageInfo.senderName = this.userName
      this.sendMessageInfo.sendMessage = this.sendMessage
      this.sendMessageInfo.receiverName = this.groupName
      this.sendMessageInfo.groupId=this.groupId
      // this.sendMessageInfo.fileUrl = this.uploadFile.name+"_"+this.uuid()
      // this.uploadFile.name = this.uploadFile.name+new Date().getTime().toString()
      // this.uploadFile = this.uploadFile
      let fileName = new Date().getTime().toString()+"_"+this.uploadFile.name
      // this.sendMessageInfo.fileUrl = "C:\\zyz\\biyesheji\\xichat\\xichat-vue\\xichat-vue\\src\\static\\"+fileName
      // let file =  this.uploadFile
      if (this.uploadFile.type!==""){
        this.sendMessageInfo.fileUrl = "/static/images/"+fileName
      }else{
        this.sendMessageInfo.fileUrl = "/static/files/"+fileName
      }
      this.sendMessageInfo.fileUrl = this.encrypt( this.sendMessageInfo.fileUrl)
      let fileFormData  = new FormData();
      console.log(this.uploadFile)
      fileFormData.append('file', this.uploadFile, fileName);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }
      console.log(this.uploadFile)
      this.sendMessageInfo.fileName = this.uploadFile.name
      this.sendMessageInfo.fileType = this.uploadFile.type
      this.axios.post('/friend/uploadFile',fileFormData, requestConfig).then(function (data) {
        _this.uploadReturnMessage = data.data
        _this.sendMessageBySocket()
      })
    },

    // eslint-disable-next-line no-unused-vars
    handleRemoveFile(file, fileList) {
      this.sendMessageInfo.fileUrl = file;
    },
    createWebSocket(){
      this.initWsEventHandle();
    },
    initWsEventHandle(){
      const _this = this
      // eslint-disable-next-line no-unused-vars
      this.wsObj.onopen=function (event) {
        console.log("WebSocket is open now.");
      }
      this.wsObj.onmessage = function (evt){
        console.log(evt.data)
        if ((JSON.parse(evt.data).receiverAccount!==_this.groupId&&JSON.parse(evt.data).senderAccount !== _this.userAccount) ||JSON.parse(evt.data).isGroup==='0' ){
          console.log("当前不是这个群组")
          _this.messageRemind(JSON.parse(evt.data));
        }else{
          console.log(JSON.parse(evt.data))
          console.log("收到了信息")
          _this.messageList.push(JSON.parse(evt.data))
          _this.$emit("updateGroupNotReadMessage",JSON.parse(evt.data).groupId)
        }
      }
      // console.log("执行错误")
      // this.wsObj.onerror =function (evt){this.onWsError(evt)}
      // console.log("执行关闭")
      // this.wsObj.onclose = function (evt){this.onWsClose(evt)}
    },
    sendMessageBySocket () {
      console.log("send message")
      this.sendMessageInfo.senderAccount = this.userAccount
      this.sendMessageInfo.senderName = this.userName
      this.sendMessageInfo.sendMessage = this.encrypt(this.sendMessage)
      this.sendMessageInfo.receiverAccount = this.groupId
      this.sendMessageInfo.receiverName = this.groupName
      this.sendMessageInfo.groupId= this.groupId
      // this.sendMessageInfoString = "{"+
      //     "\"sendMessage\":\""+
      //     this.sendMessageInfo.sendMessage+
      //     "\",\"senderAccount\":\""+
      //     this.sendMessageInfo.senderAccount+
      //     "\",\"senderName\":\""+
      //     this.sendMessageInfo.senderName+
      //     "\",\"receiverAccount\":\""+
      //     this.sendMessageInfo.receiverAccount+
      //     "\",\"receiverName\":\""+
      //     this.sendMessageInfo.receiverName+
      //     "\",\"fileUrl\":\""+
      //     this.sendMessageInfo.fileUrl+
      //     "\"}"
      // this.sendMessageInfoString = JSON.stringify(this.sendMessageInfo)

      this.wsObj.send(JSON.stringify(this.sendMessageInfo))
      this.sendMessageInfo.fileUrl=''
      this.sendMessageInfo.fileType=''
      this.sendMessageInfo.fileName=''
      // this.uploadFile=''
      // this.wsObj.send(this.sendMessageInfoString)
    },
    messageRemind(eve){
      console.log("群组页面"+eve)
      if(eve.isGroup==='1'){
        console.log("调用了messageGroupRemind")
        this.$emit("updateGroupListAndNotReadMessage")
      }else{
        console.log("调用了updateFriendListAndNotReadMessage")
        this.$emit("updateFriendListAndNotReadMessage")
      }
      // eslint-disable-next-line no-undef
    },
    getNotReadMessage(groupId) {
      const _this = this
      _this.axios({
        url: '/group/getGroupNotReadMessage/'+groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.messageList = rsp.data
      })
    },
    getHistoryMessageByPage(page) {
      const _this = this
      _this.axios({
        url: '/group/getHistoryMessageWithGroupByPage/'+_this.groupId+"/"+page,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.historyMessageList = rsp.data
      })
      _this.axios({
        url: '/group/getGroupHistoryMessageCount/'+_this.groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.historyMessageCount = rsp.data
      })
    },
    getAllGroupMemberUserImg(){
      const _this = this
      this.axios({
        url: '/group/getAllGroupMemberUserImg/'+this.groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.allGroupMemberUserImg = rsp.data
      })
    },
    /*查看群内所有人员*/
    getGroupMembers(){
      const _this = this
      this.axios({
        url: '/group/getGroupMemberInfo/'+this.groupId,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.groupMembers = rsp.data
        console.log(_this.groupMembers)
      })
    }
  },
  beforeDestroy() {
    // // this.onlineStatus='不在线'
    // try{
    //   // this.wsObj.onclose=(evt)=>{
    //   //   console.log(evt)
    //   // }
    //   this.wsObj.close(this.userAccount)
    // }catch (e) {
    //   console.log(e)
    //   console.log("GBeforeD出错")
    // }
  },
  mounted() {
    this.userAccount = sessionStorage.getItem("userAccount")
    this.userName = sessionStorage.getItem("userName")
    this.groupId = this.$route.query.currentGroupId
    this.groupName = this.$route.query.currentGroupName
    this.wsUri = 'ws://localhost:8100/chat/'+this.userAccount
    this.wsObj = new WebSocket(this.wsUri)
    this.createWebSocket()
    this.getAllGroupMemberUserImg()
    // this.getNotReadMessage(this.groupId)
    this.getHistoryMessageByPage(1)
    this.$emit("updateGroupListAndNotReadMessage")
  },
  beforeRouteEnter  (to, from, next) {
    // this.messageList = []
    // this.getNotReadMessage(this.$route.query.currentgroupId)
    next(
        vm=> {
          console.log("调用了beforeRouteEnter")
          vm.groupId = vm.$route.query.currentGroupId
          vm.groupName = vm.$route.query.currentGroupName
          vm.historyCurrentPage=1
          const _vm = vm
          _vm.axios({
            url: '/group/getGroupNotReadMessage/'+_vm.$route.query.currentGroupId,
            method: 'get',
            headers: {
              Authorization: sessionStorage.token
            }
          }).then(function (rsp) {
            _vm.messageList = rsp.data
            _vm.axios({
              url:'/group/updateGroupNotReadMessage/'+_vm.$route.query.currentGroupId,
              method: 'get',
              headers: {
                Authorization: sessionStorage.token
              }
            }).then(function (){
              _vm.$emit("updateGroupListAndNotReadMessage")
            })
          })

        })
  },
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 可以访问组件实例 `this`
  beforeRouteLeave (to, from, next) {
    console.log("调用了beforeRouteLeave")
    this.$emit("updateGroupListAndNotReadMessage")
    next(
    )
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 100px;
}

/*.el-aside {*/
/*  background-color: #D3DCE6;*/
/*  color: #333;*/
/*  text-align: center;*/
/*  line-height: 500px;*/
/*}*/

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 20px;
  width: 100%;
  height: 100%;
}

/*body > .el-container {*/
/*  margin-bottom: 40px;*/
/*}*/


.chat-content{
  /*width: 80%;*/
  padding: 20px;}
.word{
  display: flex;
  justify-content:flex-end;
  margin-bottom: 20px;
}
.userImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.info{
  margin-left: 10px;}
.time{
  font-size: 12px;
  color: rgba(51,51,51,0.8);
  margin: 0;
  height: 20px;
  line-height: 20px;
  margin-top: -5px;
}

.word-my{
  display: flex;
  justify-content:flex-end;
  margin-bottom: 20px;
  text-align: right;
}
.fileImg{
  width: 30%;
  height: auto;
}
.userImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.info{
  width: 90%;
  margin-right: 10px;
  text-align: left;}
.info-my{
  width: 90%;
  margin-right: 10px;
  text-align: right;}
.time{
  font-size: 12px;
  color: rgba(51,51,51,0.8);
  margin: 0;
  height: 20px;
  line-height: 20px;
  margin-top: -5px;
  margin-right: 10px;
}
.info-content-my{
  max-width: 70%;
  padding: 10px;
  font-size: 14px;
  float: right;
  margin-right: 10px;
  position: relative;
  margin-top: 8px;
  background: #A3C3F6;
  text-align: left;
}
.info-content{
  background: #FFFFFF;
  float: left;
}


</style>
