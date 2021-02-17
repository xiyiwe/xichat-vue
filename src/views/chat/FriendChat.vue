<template>
  <div>
    <el-container>
      <el-header>
        <p >
          当前聊天用户:{{this.$route.query.currentFUserName}}
        </p>
      </el-header>
      <el-container>
<!--        <el-aside ></el-aside>-->
        <el-container>
          <el-main style="height:500px;flex-grow:1;">
            <el-scrollbar >
            <div class="chat-content" >
              <!-- recordContent 聊天记录数组-->
              <div v-for="(messages,index) in messageList" :key="index" >
                <!-- 对方 -->
                <div class="word" v-if="userAccount!==messages.senderAccount">
<!--                  <img :src="messages.imgUrl">-->
                  <div class="info">
                    <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                    <p class="info-content">{{messages.messageContent}}</p>
                  </div>
                </div>
                <!-- 我的 -->
                <div class="word-my" v-else>
                  <div class="info-my">
                    <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                    <div class="info-content-my">{{messages.messageContent}}</div>
<!--                  <img :src="messages.imgUrl">-->
                  </div>
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
                          <!--                  <img :src="messages.imgUrl">-->
                          <div class="info">
                            <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                            <p class="info-content">{{messages.messageContent}}</p>
                          </div>
                        </div>
                        <!-- 我的 -->
                        <div class="word-my" v-else>
                          <div class="info-my">
                            <p class="time">{{messages.senderName}}  {{ messages.createTime | formatDate }}</p>
                            <div class="info-content-my">{{messages.messageContent}}</div>
                            <!--                  <img :src="messages.imgUrl">-->
                          </div>
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
          </el-main>
          <el-footer>
            <div>
              <el-input type="text" placeholder="请输入消息" v-model="sendMessage" style="width: 50%"/>
              <el-button type="primary"  @click="sendMessageBySocket()" >发送消息</el-button>
              <el-button @click="messageHistoryDrawer = true;getHistoryMessageByPage(1)" type="primary" style="margin-top: 10px;float: right" >
                历史记录
              </el-button>
            </div>
            <div>
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="/friend/upload"
                  accept=".png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pdf"
                  :limit="limitFile"
                  :on-change="picFile"
                  :auto-upload="false"
                  :file-list="fileList">
                <el-button  type="primary" style="margin-top: 10px;float: left" >
                  点击上传
                </el-button>
<!--                <div slot="tip" class="el-upload__tip">支持文件格式有png,jpg,jpeg,doc,docx,xls,xlsx,ppt,pdf,文件大小不超过2M</div>-->
              </el-upload>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>

  </div>



</template>

<script>
import {formatDate} from "@/utils/formatDate";

export default {
  name: "FriendChat",
  data() {
    return {
      // actionUrl:'D:\\itemRepository\\gitRepository\\xichat-vue\\src\\files\\',
      limitFile:1,
      fileList:[],
      historyMessageCount:0,
      historyCurrentPage:1,
      messageHistoryDrawer:false,
      direction: 'rtl',
      historyMessageList:[],
      messageList:[],
      fUserAccount:'',
      fUserName:'',
      sendMessage:'',
      sendMessageInfo:{
        sendMessage:'',
        senderAccount:'',
        senderName:'',
        receiverAccount:'',
        receiverName:'',
        fileUrl:''
      },
      // receiveMessageInfo: {
      //   messageId: {
      //   account: '',
      // },
      //   messageContent:'',
      //   senderAccount:'',
      //   senderName:'',
      //   receiverAccount:'',
      //   receiverName:'',
      //   fileUrl:'',
      //   createTime:''
      // },
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
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
    }
  },
  methods:{

    submitUpload(){
      if(this.fileList.length===0){
        console.log("请先选择文件")
        return
      }
      this.$refs.upload.submit();
    },
    beforeUploadFile(file){
      // console.log('before upload')
      var testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      var size = file.size / 1024 / 1024
      // var type=".png.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pdf"
      var extension  = testmsg === 'png'
      var extension1 = testmsg === 'jpg'
      var extension2 = testmsg === 'jpeg'
      var extension3 = testmsg === 'doc'
      var extension4 = testmsg === 'docx'
      var extension5 = testmsg === 'xls'
      var extension6 = testmsg === 'xlsx'
      var extension7 = testmsg === 'ppt'
      var extension8 = testmsg === 'pdf'

      if(!extension && !extension1&& !extension2&& !extension3&& !extension4&& !extension5&& !extension6&& !extension7&& !extension8) {
        this.$message.warning({
          title: '警告',
          message: "只能上传.png.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pdf的文件"
        });
        return false;
      }else {
        if(size > 2) {
          this.$message.warning({
            title: '警告',
            message: "文件大小不得超过2M"
          });
          return false;
        }
      }

      return (extension || extension1|| extension2|| extension3|| extension4|| extension5|| extension6|| extension7|| extension8) && size
    },
    picFile(file, fileList){
      // console.log("file"+JSON.stringify(file));
      // console.log('fileList',fileList)
      // //   this.ruleFormPicFont.file = file.raw
      // // // fileList.forEach(function (item) {
      // // // 	this.ruleFormPicFont.file.push(item.raw)
      // // // })
      // console.log(fileList);
      // console.log(file)
      this.sendMessageInfo.fileUrl = file
      this.fileList = fileList
      console.log(file.url)
      console.log(this.fileList)
      console.log(this.sendMessageInfo.fileUrl)

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
        if (JSON.parse(evt.data).senderAccount!==_this.fUserAccount&&JSON.parse(evt.data).senderAccount !== _this.userAccount ){
          console.log("当前不是这个好友")
          _this.messageRemind();
        }else{
          _this.messageList.push(JSON.parse(evt.data))
          _this.$emit("updateNotReadMessage",JSON.parse(evt.data).senderAccount)
        }


      }
      // console.log("执行错误")
      // this.wsObj.onerror =function (evt){this.onWsError(evt)}
      // console.log("执行关闭")
      // this.wsObj.onclose = function (evt){this.onWsClose(evt)}
    },
    sendMessageBySocket: function () {
      console.log("send message")
      this.sendMessageInfo.senderAccount = this.userAccount
      this.sendMessageInfo.senderName = this.userName
      this.sendMessageInfo.sendMessage = this.sendMessage
      this.sendMessageInfo.receiverAccount = this.fUserAccount
      this.sendMessageInfo.receiverName = this.fUserName
      this.sendMessageInfoString = "{"+
          "\"sendMessage\":\""+
          this.sendMessageInfo.sendMessage+
          "\",\"senderAccount\":\""+
          this.sendMessageInfo.senderAccount+
          "\",\"senderName\":\""+
          this.sendMessageInfo.senderName+
          "\",\"receiverAccount\":\""+
          this.sendMessageInfo.receiverAccount+
          "\",\"receiverName\":\""+
          this.sendMessageInfo.receiverName+
          "\",\"fileUrl\":\""+
          this.sendMessageInfo.fileUrl+
          "\"}"
      // this.sendMessageInfoString = JSON.stringify(this.sendMessageInfo)

      // console.log(this.sendMessageInfoString)
      this.wsObj.send(this.sendMessageInfoString)
    },
    messageRemind(){
      // eslint-disable-next-line no-undef
      console.log("调用了messageRemind")
      this.$emit("updateFriendListAndNotReadMessage")
    },
    getNotReadMessage(fUserAccount) {
      const _this = this
      _this.axios({
        url: '/friend/getFriendNotReadMessage/'+fUserAccount,
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
        url: '/friend/getHistoryMessageWithFriendByPage/'+_this.fUserAccount+"/"+page,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.historyMessageList = rsp.data
      })
      _this.axios({
        url: '/friend/getHistoryMessageCount/'+_this.fUserAccount,
        method: 'get',
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (rsp) {
        _this.historyMessageCount = rsp.data
      })
    }
  },

  mounted() {
    this.userAccount = sessionStorage.getItem("userAccount")
    this.userName = sessionStorage.getItem("userName")
    this.fUserAccount = this.$route.query.currentFUserAccount
    this.fUserName = this.$route.query.currentFUserName
    this.wsUri = 'ws://localhost:8100/friendsChat/'+this.userAccount
    this.wsObj = new WebSocket(this.wsUri)
    this.createWebSocket()
    this.getNotReadMessage(this.fUserAccount)
    this.getHistoryMessageByPage(1)
  },
  beforeRouteEnter  (to, from, next) {
    // this.messageList = []
    // this.getNotReadMessage(this.$route.query.currentFUserAccount)
    next(
        vm=> {
          vm.fUserAccount = vm.$route.query.currentFUserAccount
          vm.fUserName = vm.$route.query.currentFUserName
          vm.messageList = []
          vm.historyCurrentPage=1
          const _vm = vm
        _vm.axios({
          url: '/friend/getFriendNotReadMessage/'+_vm.$route.query.currentFUserAccount,
          method: 'get',
          headers: {
            Authorization: sessionStorage.token
          }
        }).then(function (rsp) {
          _vm.messageList = rsp.data
        })
    }
    )
    },
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    'scroll-bottom'(el) {
      //console.log(el.scrollTop);
      setTimeout(function () {
        el.scrollTop += 9999;
      }, 1)
    }
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
img{
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
img{
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
/*//小三角形!**!*/
/*  .info-content::after{*/
/*    position: absolute;*/
/*    right: -8px;*/
/*    top: 8px;*/
/*    content: '';*/
/*    border-left: 10px solid #A3C3F6;*/
/*    border-top: 8px solid transparent;*/
/*    border-bottom: 8px solid transparent;*/
/*  }*/

</style>
