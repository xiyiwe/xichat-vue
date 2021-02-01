<template>
    <div id="app">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
            <message></message>
            <usertext></usertext>
        </div>
    </div>
</template>

<script>
    import card from '../../components/chat/card.vue'
    import list from '../../components/chat/list.vue'
    import message from '../../components/chat/message.vue'
    import usertext from '../../components/chat/usertext.vue'

    // const ws = new WebSocket('ws://localhost:8100')
    export default {
        name: 'FriendChat',
      methods:{
      //   handleSendBtnClick(e){
      //     const msg = this.msg;
      //     if (!msg.trim().length){}
      //     return ;
      //   },
      //   handleWsOpen(e){
      //       const msg = this.msg;
      //       if (!msg.trim().length){}
      //       return ;
      //   },
      //   handleWsClose(e){
      //
      //   },
      //   handleWsError(e){
      //
      //   },
      //   handleWsMessage(e){
      //
      //   },
      //
      // },
      //   mount(){
      //       ws.addEventListener('open',this.handleWsOpen.bind(this),false)
      //       ws.addEventListener('close',this.handleWsClose.bind(this),false)
      //       ws.addEventListener('error',this.handleWsError.bind(this),false)
      //       ws.addEventListener('message',this.handleWsMessage.bind(this),false )
          },
        data () {
            return {
              msg:'',
              username:'',
              msgList:[]
            }
        },
        mounted:function() {
            this.$store.dispatch('initData');
        },
        components:{
            card,
            list,
            message,
            usertext
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        margin: 20px auto;
        width: 800px;
        height: 600px;
        overflow: hidden;
        border-radius: 10px;
        .sidebar, .main {
            height: 100%;
        }
        .sidebar {
            float: left;
            color: #f4f4f4;
            background-color: #2e3238;
            width: 200px;
        }
        .main {
            position: relative;
            overflow: hidden;
            background-color: #eee;
        }
    }
</style>
