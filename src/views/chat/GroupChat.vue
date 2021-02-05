<template>
<div>聊天页面
  <div>
    <div>
      <textarea v-model="message"></textarea>
    </div>
    <div>
      消息：<input type="text" v-model="msg"/>
    </div>
    <div>
      <input type="button" value="发送消息" @click="sendMessageBySocket()"/>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: "GroupChat",
  data() {
    return {
      groupName:'',
      groupId:'',
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
      // eslint-disable-next-line no-unused-vars
      this.wsObj.onmessage = function (evt){
        console.log("执行信息")
        this.message = evt.data
        console.log(this.message)
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
    sendMessageBySocket(){
      console.log("send message")
        this.wsObj.send(this.msg)
    }
  },
  mounted() {
    this.userAccount = sessionStorage.getItem("userAccount")
    this.groupName = this.$route.query.currentGroupName
    this.groupId = this.$route.query.currentGroupId
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

</style>
