<template>
  <el-form style="width: 60%; text-align:center" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="新建群名" prop="groupName">
      <el-input v-model="ruleForm.groupName"></el-input>
    </el-form-item>
    <span>{{errMsg}}</span>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">新建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "AddGroup",
  data() {
    return {
      errMsg:'',
      ruleForm: {
        groupName: '',
      },

      rules: {
        groupName: [
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
        url: '/group/addgroup/'+this.ruleForm.groupName,
        method:'post',
        // data: {
        //   'userAccount' :this.ruleForm.userAccount
        // },
        headers: {
          Authorization: sessionStorage.token
        }
      }).then(function (resp) {
        if (resp.data.msg === 'ok') {
          _this.$alert(_this.ruleForm.groupName + ' 新建成功！', '消息', {
            confirmButtonText: '确定',
            // eslint-disable-next-line no-unused-vars
            callback: action => {
              _this.$router.push('/addgroup')
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
