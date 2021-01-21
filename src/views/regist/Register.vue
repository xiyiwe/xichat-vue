<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">注册</h3>
      <el-form-item label="账号" prop="userAccount">
        <el-input type="text" name="userAccount"  v-model="form.userAccount"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" name="password" v-model="form.password"/>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input type="text" name="userName" v-model="form.userName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="doRegister()">注册</el-button>
      </el-form-item>
      <span >{{ errorMessage }}</span>
    </el-form>

  </div>
</template>

<script>
import cryptoAES from '../../utils/js/cryptoAES'
export default {
  name: 'Register',
  data () {
    return {
      // SURL:'localhost:8100',
      result: '',
      userAccount: '',
      password: '',
      // var CRYPTOJSKEY= "ig5hqwkWRPA4+a9A/ORR3vAtYRHLlHVa";
      // CRYPTOJSKEY: 'ig5hqwkWRPA4+a9A/ORR3vAtYRHLlHVa',
      loginInfo: {
        userAccount: this.encrypt(this.userAccount), // 用户名
        password: this.encrypt(this.password),// 密码
        userName: this.encrypt(this.userName) // 用户名
      },
      errorMessage: '',
      form: {
        userAccount: '',
        password: ''
      },

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        userAccount: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '用户名不可为空', trigger: 'blur'}
        ]
      },

      // 对话框显示和隐藏
      dialogVisible: false
    }
  },
  methods: {

    // 加密
    encrypt (word) {
      // let _this = this
      // let key = CryptoJS.enc.Utf8.parse(_this.CRYPTOJSKEY)
      // let srcs = CryptoJS.enc.Utf8.parse(word)
      // let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
      return cryptoAES.encrypt(word)
    },
    // 解密
    decrypt (word) {
      // const _this = this
      // let key = CryptoJS.enc.Utf8.parse(_this.CRYPTOJSKEY)
      // let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
      return cryptoAES.decrypt(word)
    },
    doRegister () {
      const _this = this
      _this.errorMessage = ''
      // 为表单绑定验证功能
          this.axios(
              {
                url: '/register',
                method: 'post',
                data: {
                  // loginInfo: this.loginInfo
                  'userAccount': this.encrypt(_this.form.userAccount), // 用户名
                  'password': this.encrypt(_this.form.password),// 密码
                  'userName': this.form.userName
                  // loginInfo: {
                  //   'userAccount': this.encrypt(_this.form.userAccount), // 用户名
                  //   'password': this.encrypt(_this.form.password) // 密码
                  // },
                }
              })
              // this.axios.post('/login',this.loginInfo)
              .then(function (resp) {
                console.log(resp)
                if(resp.data!=='ok')
                {
                  _this.errorMessage = resp.data
                }else{
                  _this.$router.push('/login')
                }


                // if (resp.data.authority === 'student') {
                //   sessionStorage.setItem('authority', 'student')
                //   sessionStorage.setItem('currentUser', resp.data.swno)
                //   _this.$router.push('/studentMain')
                // }
              })
        }
      // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
      // this.$router.push("/adminMain");

  }
}
</script>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>
