<template>
    <div>
        <el-scrollbar style="height:70%">
        <div v-for="(currentNotify,index) in notifyList" :key="index" >
            <p>内容:{{currentNotify.content}}</p>
            <p>类型:{{currentNotify.type}}</p>
            <p>发送时间:{{currentNotify.createTime | formatDate}}</p>
            <p>状态:{{currentNotify.isConfirm | notifyIsConfirm}}</p>
            <p v-if="currentNotify.result!==''">结果:{{currentNotify.result | notifyResult}}</p>
            <el-button v-if="currentNotify.result===''||currentNotify.result == null" @click="handleFriendInviteNotify(currentNotify,1)" type="text" size="small">同意</el-button>
            <el-button v-if="currentNotify.result===''||currentNotify.result == null" @click="handleFriendInviteNotify(currentNotify,0)" type="text" size="small">拒绝</el-button>
            <p>=================================================</p>
        </div>
        </el-scrollbar>
    </div>
</template>

<script>
    import {formatDate} from "@/utils/formatDate";
export default {
  name: "Notify",
    data(){
      return {
        notify:{
            notifyId:'',
            content:'',
            isConfirm:'',
            result:'',
            receiverAccount:'',
            senderName:'',
            receiverName:'',
            senderAccount:'',
            createTime:''
        },
        notifyList:[]
      }
    },
    filters:{
        formatDate(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
        },
        notifyResult(result) {
            if (result===1){
                return "已接受"
            }else if(result===0){
                return "已拒绝"
            }else{
                return "未知"
            }
        },
        notifyIsConfirm(IsConfirm){
            if (IsConfirm===1){
                return "已处理"
            }else if(IsConfirm===0){
                return "未处理"
            }else{
                return "未知"
            }
        }
    },
    methods:{
      getAllUserNotify(){
          const _this = this
          this.axios({
              url: '/notify/getUserAllNotify',
              method:'get',
              headers: {
                  Authorization: sessionStorage.token
              }
          }).then(function (resp) {
              console.log( resp.data)
             _this.notifyList  = resp.data
          })
      },
        handleFriendInviteNotify(currentNotify,result){
            const _this = this
            // _this.notify = currentNotify
            this.axios({
                url: '/notify/handleFriendInviteNotify',
                method:'post',
                data: {
                    'notifyId' :currentNotify.notifyId,
                    'content': currentNotify.content,
                    'isConfirm':currentNotify.isConfirm,
                    'type': currentNotify.type,
                    'result': result,
                    'senderAccount': currentNotify.senderAccount,
                    'receiverAccount': currentNotify.receiverAccount,
                    'createTime': currentNotify.createTime,
                },
                headers: {
                    Authorization: sessionStorage.token
                }
            }).then(function () {
                _this.getAllUserNotify()
                _this.$emit("updateFriendListAndNotReadMessage")
            })
        }
    },
    mounted() {
        this.getAllUserNotify()
    }
}
</script>

<style scoped>

</style>
