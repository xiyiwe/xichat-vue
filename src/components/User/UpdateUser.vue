<template>
  <el-form style="width: 60%; text-align:center" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="用户账号" prop="userAccount">
      <el-input disabled="disabled" v-model="ruleForm.userAccount"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="ruleForm.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <span>{{errMsg}}</span>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import cryptoAES from '../../utils/js/cryptoAES'
  export default {
    name: "UpdateUser",
    data() {
      return {
        errMsg:'',
        ruleForm: {
          userAccount: '',
          userName:'',
          password:''
        },

        rules: {
          userAccount: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
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
                  url: '/user/updateuser',
                  method:'post',
                  data: {
                    'userAccount' :this.ruleForm.userAccount,
                    'userName':this.ruleForm.userName,
                    'password':cryptoAES.encrypt(this.ruleForm.password)
                  },
                  headers: {
                    Authorization: sessionStorage.token
                  }
                }).then(function (resp) {
                  if (resp.data === 'ok') {
                    _this.$alert(_this.ruleForm.userAccount + ' 修改成功！', '消息', {
                      confirmButtonText: '确定',
                      // eslint-disable-next-line no-unused-vars
                      callback: action => {
                        sessionStorage.setItem('userName',_this.ruleForm.userName)
                        sessionStorage.setItem('userAccount',_this.ruleForm.userAccount)
                        _this.$router.push('/updateUser')
                        window.location.reload()
                      }
                    })
                  }else{
                    _this.errMsg=resp.data
                  }
                })
              ;
          },

        },
    mounted() {
      this.ruleForm.userAccount=sessionStorage.getItem("userAccount")
      this.ruleForm.userName=sessionStorage.getItem("userName")
    }
  }
</script>

