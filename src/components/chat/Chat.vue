<template>
<div>聊天页面
  <div  >
    {{openMessage}}
    {{closeMessage}}
    {{message}}
    {{errorMessage}}
  </div>
  <div>
    <textarea id="debugInfo"></textarea>
    <div>
      消息：<input type="text" v-model="msg"/>
    </div>
    <div>
      <input type="button" value="发送消息" onclick="sendMessageBySocket()"/>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      msg:'',
      openMessage:'',
      closeMessage:'',
      errorMessage:'',
      message:'',
      userAccount: '',
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
      console.log("执行信息")
      this.wsObj.onmessage = function (evt){this.onWsMessage(evt)}
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
    sendMessageBySocket(){
        this.wsObj.send(this.msg)
    }
  },
  mounted() {
    this.userAccount = sessionStorage.getItem("userAccount")
    this.wsUri = 'ws://localhost:8100/friendsChat/'+this.userAccount
    this.wsObj = new WebSocket(this.wsUri)
    console.log(this.wsUri )
    this.createWebSocket()
  }
}
</script>

<style scoped>

</style>
