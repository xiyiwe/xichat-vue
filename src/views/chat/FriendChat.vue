<template>
  <div>
    <el-container>
      <el-header>
        head
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>
            <div class="chat-content">
              <!-- recordContent 聊天记录数组-->
              <div v-for="(messages,indexc) in messageList" :key="indexc">
                <!-- 对方 -->
                <div class="word" v-if="userAccount!==messages.senderAccount">
                  <img :src="messages.imgUrl">
                  <div class="info">
                    <p class="time">{{messages.senderName}}  {{messages.createTime}}</p>
                    <div class="info-content">{{messages.sendMessage}}</div>
                  </div>
                </div>
                <!-- 我的 -->
                <div class="word-my" v-else>
                  <div class="info">
                    <p class="time">{{messages.senderName}}  {{messages.createTime}}</p>
                    <div class="info-content">{{messages.sendMessage}}</div>
                  </div>
                  <img :src="messages.imgUrl">
                </div>
              </div>
            </div>
          </el-main>
          <el-footer>
            <div>
              消息：<input type="text" v-model="sendMessage"/>
              <input type="button" value="发送消息" @click="sendMessageBySocket()"/>
            </div>


          </el-footer>
        </el-container>
      </el-container>
    </el-container>

  </div>



</template>

<script>
export default {
  name: "FriendChat",
  data() {
    return {
      messageList:[
        {
          sendMessage:'',
          senderAccount:'',
          senderName:'',
          receiverAccount:'',
          receiverName:'',
          imgUrl:'',
          createTime:''
        }
      ],
      fUserAccount:'',
      fUserName:'',
      sendMessage:'',
      sendMessageInfo:{
        sendMessage:'',
        senderAccount:'',
        senderName:'',
        receiverAccount:'',
        receiverName:'',
        imgUrl:''
      },
      receiveMessageInfo:{
        sendMessage:'',
        senderAccount:'',
        senderName:'',
        receiverAccount:'',
        receiverName:'',
        imgUrl:'',
        createTime:''
      },
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
  methods:{
    createWebSocket(){
        this.initWsEventHandle();
    },
    initWsEventHandle(){
      // eslint-disable-next-line no-unused-vars
      this.wsObj.onopen=function (event) {
        console.log("WebSocket is open now.");
      }
      // eslint-disable-next-line no-unused-vars
      this.wsObj.onmessage = function (evt){
        console.log("接收消息")
        console.log(JSON.parse(evt.data))
        this.receiveMessageInfo = JSON.parse(evt.data)
      }
      console.log("执行错误")
      this.wsObj.onerror =function (evt){this.onWsError(evt)}
      console.log("执行关闭")
      this.wsObj.onclose = function (evt){this.onWsClose(evt)}
    },
    onWsOpen(evt){
      this.openMessage = evt.data
    },
    onWsMessage(evt){
      this.message = evt.data
    },
    onWsError(evt){
      this.errorMessage = evt.data
    },
    onWsClose(evt){
      this.closeMessage = evt.data
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
          "\",\"imgUrl\":\""+
          this.sendMessageInfo.imgUrl+
          "\"}"
      // this.sendMessageInfoString = JSON.stringify(this.sendMessageInfo)

      console.log(this.sendMessageInfoString)
      this.wsObj.send(this.sendMessageInfoString)
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
  },
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
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 500px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 360px;
}

body > .el-container {
  margin-bottom: 40px;
}


.chat-content{
  width: 100%;
  padding: 20px;}
.word{
  display: flex;
  margin-bottom: 20px;}
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
.info-content{
  padding: 10px;
  font-size: 14px;
  background: #fff;
  position: relative;
  margin-top: 8px;
}
/*小三角形*/
  .info-content::before{
    position: absolute;
    left: -8px;
    top: 8px;
    content: '';
    border-right: 10px solid #FFF;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }


.word-my{
  display: flex;
  justify-content:flex-end;
  margin-bottom: 20px;}
img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.info{
  width: 90%;
  margin-left: 10px;
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
.info-content{
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
/*//小三角形!**!*/
  .info-content::after{
    position: absolute;
    right: -8px;
    top: 8px;
    content: '';
    border-left: 10px solid #A3C3F6;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }

</style>
