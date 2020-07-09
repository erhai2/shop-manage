<template>
  <div class="home">
    <h1>home</h1>
    <el-button type="text" @click="logout">退出</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data(){
    return{

    }
  },
  methods:{
    // 退出
    logout(){
      // 清除token
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
