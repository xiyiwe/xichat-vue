<template>
  <el-form style="width: 60%; text-align:center" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="用户账号" prop="userAccount">
      <el-input v-model="ruleForm.userAccount"></el-input>
    </el-form-item>
    <span>{{errMsg}}</span>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "AddFriend",
    data() {
      return {
        errMsg:'',
        ruleForm: {
          userAccount: '',
        },

        rules: {
          userAccount: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      }
      },
        methods: {
          submitForm() {
            const _this = this
            console.log(this.ruleForm.userAccount)
            this.ruleForm.userAccount =this.ruleForm.userAccount.replace(/(\s*$)/g,"")
                this.axios({
                  url: '/friend/addfriend/'+this.ruleForm.userAccount,
                  method:'get',
                  // data: {
                  //   'userAccount' :this.ruleForm.userAccount
                  // },
                  headers: {
                    Authorization: sessionStorage.token
                  }
                }).then(function (resp) {
                  if (resp.data.msg === 'ok') {
                    _this.$alert(_this.ruleForm.userAccount + ' 添加成功！', '消息', {
                      confirmButtonText: '确定',
                      // eslint-disable-next-line no-unused-vars
                      callback: action => {
                        _this.$router.push('/addFriend')
                        window.location.reload()
                      }
                    })
                  }else{
                    _this.errMsg=resp.data.msg
                  }
                })
              ;
          },
          //   resetForm(formName) {
          //     this.$refs[formName].resetFields();
          //   }
          // },
          //   created() {
          //     const _this=this
          //     this.axios.get('/department/selectDepartmentAllName').then(function(resp){
          //       _this.dOptions = resp.data
          //
          //   })
        }
      }
</script>

