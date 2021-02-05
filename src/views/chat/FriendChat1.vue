<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--      <el-header>-->
<!--        head-->
<!--      </el-header>-->
<!--      <el-container>-->
<!--        <el-aside width="200px">Aside</el-aside>-->
<!--        <el-container>-->
<!--          <el-main>-->
<!--            <div class="grid-content bg-purple">-->
<!--              <textarea v-model="message"></textarea>-->
<!--              main-->
<!--            </div>-->
<!--          </el-main>-->
<!--          <el-footer>-->
<!--            <div>-->
<!--              消息：<input type="text" v-model="sendMessage"/>-->
<!--            </div>-->
<!--            <div>-->
<!--              <input type="button" value="发送消息" @click="sendMessageBySocket()"/>-->
<!--              Footer-->
<!--            </div>-->

<!--          </el-footer>-->
<!--        </el-container>-->
<!--      </el-container>-->
<!--    </el-container>-->

<!--  </div>-->



<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "FriendChat",-->
<!--  data() {-->
<!--    return {-->
<!--      fUserAccount:'',-->
<!--      fUserName:'',-->
<!--      sendMessage:'',-->
<!--      sendMessageInfo:[{-->
<!--        sendMessage:'',-->
<!--        senderAccount:'',-->
<!--        senderName:'',-->
<!--        receiverAccount:'',-->
<!--        receiverName:''-->
<!--      }-->
<!--      ],-->
<!--      sendMessageInfoString:'',-->
<!--      openMessage:'',-->
<!--      closeMessage:'',-->
<!--      errorMessage:'',-->
<!--      message:'',-->
<!--      userAccount: '',-->
<!--      userName:'',-->
<!--      wsUri :'' ,-->
<!--      wsObj: ''-->
<!--    }-->
<!--  },-->
<!--  methods:{-->
<!--    createWebSocket(){-->

<!--        this.initWsEventHandle();-->

<!--    },-->
<!--    initWsEventHandle(){-->
<!--      // eslint-disable-next-line no-unused-vars-->
<!--      this.wsObj.onopen=function (event) {-->
<!--        console.log("WebSocket is open now.");-->
<!--      }-->
<!--      // eslint-disable-next-line no-unused-vars-->
<!--      this.wsObj.onmessage = function (evt){-->
<!--        console.log("执行信息")-->
<!--        console.log(evt)-->
<!--        this.message = evt.data-->
<!--        console.log(this.message)-->
<!--      }-->
<!--      console.log("执行错误")-->
<!--      this.wsObj.onerror =function (evt){this.onWsError(evt)}-->
<!--      console.log("执行关闭")-->
<!--      this.wsObj.onclose = function (evt){this.onWsClose(evt)}-->
<!--    },-->
<!--    onWsOpen(evt){-->
<!--      this.openMessage = evt.data-->
<!--    },-->
<!--    onWsMessage(evt){-->
<!--      this.message = evt.data-->
<!--    },-->
<!--    onWsError(evt){-->
<!--      this.errorMessage = evt.data-->
<!--    },-->
<!--    onWsClose(evt){-->
<!--      this.closeMessage = evt.data-->
<!--    },-->
<!--    sendMessageBySocket: function () {-->
<!--      console.log("send message")-->
<!--      this.sendMessageInfo.senderAccount = this.userAccount-->
<!--      this.sendMessageInfo.senderName = this.userName-->
<!--      this.sendMessageInfo.sendMessage = this.sendMessage-->
<!--      this.sendMessageInfo.receiverAccount = this.fUserAccount-->
<!--      this.sendMessageInfo.receiverName = this.fUserName-->
<!--      this.sendMessageInfoString = "{"+-->
<!--          "\"sendMessage\":\""+-->
<!--          this.sendMessageInfo.sendMessage+-->
<!--          "\",\"senderAccount\":\""+-->
<!--          this.sendMessageInfo.senderAccount+-->
<!--          "\",\"senderName\":\""+-->
<!--          this.sendMessageInfo.senderName+-->
<!--          "\",\"receiverAccount\":\""+-->
<!--          this.sendMessageInfo.receiverAccount+-->
<!--          "\",\"receiverName\":\""+-->
<!--          this.sendMessageInfo.receiverName+-->
<!--          "\"}"-->
<!--      // this.sendMessageInfoString = JSON.stringify(this.sendMessageInfo)-->

<!--      console.log(this.sendMessageInfoString)-->
<!--      this.wsObj.send(this.sendMessageInfoString)-->
<!--    }-->
<!--  },-->
<!--  // message:'',-->
<!--  // senderAccount:'',-->
<!--  // senderName:'',-->
<!--  // receiverAccount:'',-->
<!--  // receiverName:''-->
<!--  mounted() {-->
<!--    this.userAccount = sessionStorage.getItem("userAccount")-->
<!--    console.log(this.userAccount+"1")-->
<!--    this.userName = sessionStorage.getItem("userName")-->
<!--    this.fUserAccount = this.$route.query.currentFUserName-->
<!--    this.fUserName = this.$route.query.currentFUserAccount-->
<!--    this.wsUri = 'ws://localhost:8100/friendsChat/'+this.userAccount-->
<!--    this.wsObj = new WebSocket(this.wsUri)-->
<!--    this.createWebSocket()-->
<!--  },-->
<!--  directives: {/*这个是vue的自定义指令,官方文档有详细说明*/-->
<!--    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟-->
<!--    'scroll-bottom'(el) {-->
<!--      //console.log(el.scrollTop);-->
<!--      setTimeout(function () {-->
<!--        el.scrollTop += 9999;-->
<!--      }, 1)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.el-header, .el-footer {-->
<!--  background-color: #B3C0D1;-->
<!--  color: #333;-->
<!--  text-align: center;-->
<!--  line-height: 60px;-->
<!--}-->

<!--.el-aside {-->
<!--  background-color: #D3DCE6;-->
<!--  color: #333;-->
<!--  text-align: center;-->
<!--  line-height: 200px;-->
<!--}-->

<!--.el-main {-->
<!--  background-color: #E9EEF3;-->
<!--  color: #333;-->
<!--  text-align: center;-->
<!--  line-height: 160px;-->
<!--}-->

<!--body > .el-container {-->
<!--  margin-bottom: 40px;-->
<!--}-->

<!--.el-container:nth-child(5) .el-aside,-->
<!--.el-container:nth-child(6) .el-aside {-->
<!--  line-height: 260px;-->
<!--}-->

<!--.el-container:nth-child(7) .el-aside {-->
<!--  line-height: 320px;-->
<!--}-->
<!--</style>-->
