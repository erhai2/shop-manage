<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avator_box">
        <img src="../assets/logo.png" class="avator_img" />
      </div>
       <!-- 表单 -->
        <el-form ref="LoginFormRef" :model="loginForm" label-width="0" :rules="LoginFormRules" class="login_form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form> 
    
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
       loginForm:{
          username:'admin',
          password:'123456'
        },
        LoginFormRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
    };
  },
  methods:{
    
    login(){
      this.$refs.LoginFormRef.validate(async (valid) => {
        if(valid){
          let {data:res} = await this.$axios.post('/login',this.loginForm)
          // console.log(res)
          // 请求成功
          if(res.meta.status == 200){
            this.$message({
              message:res.meta.msg,
              type: 'success',
              duration:1000
            })
            // 存储token
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
          }
          // 用户名或密码错误
          else{
            this.$message({
              message:res.meta.msg,
              type:'error'
            })
          }
        }
        else{
          return false
        }
      })
    },
    // 重置
    resetLoginForm(){
      this.$refs.LoginFormRef.resetFields()
    }
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avator_box {
  width: 110px;
  height: 110px;
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  .avator_img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form{
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 30px;
  box-sizing: border-box;
}
</style>