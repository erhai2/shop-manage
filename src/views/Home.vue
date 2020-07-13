<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <el-header>
        <img src="../assets/logo.png" class="logo" />
        <span class="system_name">后台管理系统</span>
        <div class="operate">
          <!-- 弹出框提示 -->
          <el-popover width="160" v-model="logontPopoverVisible">
            <p style="text-align: center">确定离开吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="logontPopoverVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="logout">确定</el-button>
            </div>
            <el-button type="text" slot="reference">退出</el-button>
          </el-popover>
        </div>
      </el-header>
      <!-- 内容部分 -->
      <el-container>
        <!-- 左侧 -->
        <el-aside width="200px">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#2b4b6be8"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse="isCollapse"
            unique-opened
            router
          >
            <!-- 折叠 -->
            <span class="collapse" @click="isCollapse = !isCollapse">
              <i :class="collapseIcon"></i>
            </span>
            <!-- 菜单选项 -->
            <el-submenu :index="item.id + ''" v-for="item of menuList" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item 
                :index="'/' + subItem.path" 
                v-for="subItem of item.children" 
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>

            <!-- <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>-->
          </el-menu>
        </el-aside>
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      logontPopoverVisible: false,
      menuList:[],
      iconObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-key',
        '101':'el-icon-goods',
        '102':'el-icon-tickets',
        '145':'el-icon-pie-chart',
      }
    }
  },
  methods: {
    // 退出
    logout() {
      this.logontPopoverVisible = false;
      // 清除token
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {

    },
    // 请求菜单列表
     async getMenuList(){
      let {data:res} = await this.$axios.get('/menus') 
      if(res.meta.status == 200){
        this.menuList = res.data
        // console.log(this.menuList)
      }
      else{
        this.$message.error(res.meta.msg)
      }

    }
  },
  computed: {
    collapseIcon() {
      return {
        "el-icon-s-fold": this.isCollapse,
        "el-icon-s-unfold": !this.isCollapse
      }
    }
  },
  created(){
    this.getMenuList()
  }
};
</script>
<style lang="scss" scoped>
.el-header {
  background-color: #2b4b6b;
  color: #fff;
  text-align: left;
  line-height: 60px;
  vertical-align: middle;
  display: flex;
  align-items: center;
  padding-left: 50px;
  .logo {
    width: 30px;
    height: 30px;
  }
  .system_name {
    font-size: 1.1rem;
    margin-left: 30px;
  }
  .operate {
    position: absolute;
    right: 40px;
  }
}

.el-aside {
  color: #fff;
  text-align: left;
  line-height: 100%;
  .collapse {
    display: inline-block;
    padding: 10px;
    font-size: 1.3rem;
    margin-left: 30%;
  }
  .el-menu {
    border-right: none;
    height: 100%;
  }
  .el-menu-item i{
    margin-left: 15px ;
  }
}
.el-main{
  background-color: #eaedf1;
}
</style>
