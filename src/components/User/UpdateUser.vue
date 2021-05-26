<template>
  <el-form style="width: 60%; text-align:center" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="用户账号" maxlength="10" prop="userAccount">
      <el-input disabled="disabled" v-model="ruleForm.userAccount"></el-input>
    </el-form-item>
    <el-form-item label="用户名"  prop="userName">
      <el-input maxlength="20" v-model="ruleForm.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码"  prop="password">
      <el-input type="password" maxlength="20" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="userImg">
      <input type="file"  value="选择文件"  @change="getFile($event)"/>
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
        uploadReturnMessage:'',
        errMsg:'',
        uploadFile:'',
        ruleForm: {
          userAccount: '',
          userName:'',
          password:'',
          userImg:''
        },
        rules: {
          userAccount: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'},
            { pattern: '^[\\w\\W]{6,}$' ,
              message: '密码需大于等于6位' }
          ],
        }
      }
      },
        methods: {
            submitForm() {
            const _this = this

            this.ruleForm.userAccount =this.ruleForm.userAccount.replace(/(\s*$)/g,"")
              console.log(this.ruleForm.userImg)
              console.log(this.uploadFile)
                this.axios({
                url: '/user/updateuser',
                method:'post',
                data: {
                  'userAccount' :this.ruleForm.userAccount,
                  'userName':this.ruleForm.userName,
                  'password':cryptoAES.encrypt(this.ruleForm.password),
                  'userImg': this.ruleForm.userImg
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
                        sessionStorage.setItem('userImg',_this.ruleForm.userImg)
                        _this.$router.push('/user/updateUser')
                        window.location.reload()
                      }
                    })
                  }else{
                    _this.errMsg=resp.data
                  }
                })
              ;
          },
          getFile(event){
            let _this = this
            var file = event.target.files;
            this.uploadFile=file[0]
            for(var i = 0;i<file.length;i++){
              //    上传类型判断
              var r = new FileReader()
              r.readAsDataURL(file[0])
              r.onload = function(e){
                _this.ruleForm.userImg = e.target.result //base64格式
                console.log(_this.ruleForm.userImg) //输出看一下
              }

              if(file[i].size>=10485760){
                this.uploadReturnMessage = "文件过大"
                return false
              }

              var imgName = file[i].name;
              var idx = imgName.lastIndexOf(".");
              if (idx != -1){
                var ext = imgName.substr(idx+1).toUpperCase();
                ext = ext.toLowerCase( );
                if ( ext!='jpg' && ext!='png' ){
                  this.uploadReturnMessage = "文件格式不规范"
                  return false
                }else if(this.uploadFile.name.indexOf("%") !== -1){
                  this.uploadReturnMessage = "文件名不能含有%"
                  return false
                }
              }
            }
          }
        },
    mounted() {
      this.ruleForm.userAccount=sessionStorage.getItem("userAccount")
      this.ruleForm.userName=sessionStorage.getItem("userName")
    }
  }
</script>

