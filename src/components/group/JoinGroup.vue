<template>
  <el-form style="width: 60%; text-align:center" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="加入的群ID" prop="groupId">
      <el-input v-model="ruleForm.groupId"></el-input>
    </el-form-item>
    <span>{{errMsg}}</span>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">加入</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "JoinGroup",
  data() {
    return {
      errMsg:'',
      ruleForm: {
        groupId: '',
      },

      rules: {
        groupId: [
          {required: true, message: '群名不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm() {
      const _this = this
      console.log(this.ruleForm.groupName)
      // this.ruleForm.groupName =this.ruleForm.groupName.replace(/(\s*$)/g,"")
      this.axios({
        url: '/group/joingroup/'+this.ruleForm.groupId,
        method:'post',
        // data: {
        //   'userAccount' :this.ruleForm.userAccount
        // },
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (resp) {
        if (resp.data.msg === 'ok') {
          _this.$alert(_this.ruleForm.groupId + ' 加入成功！', '消息', {
            confirmButtonText: '确定',
            // eslint-disable-next-line no-unused-vars
            callback: action => {
              _this.$router.push('/joingroup')
              window.location.reload()
            }
          })
        }else{
          _this.errMsg=resp.data.msg
        }
      })
      ;
    },

  }
}
</script>

<style scoped>

</style>
