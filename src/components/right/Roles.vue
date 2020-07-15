<template>
  <div>
    <breadcrumb-header parentItem="权限管理" subItem="角色列表"></breadcrumb-header>
    <!-- 内容 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="2">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border style="width: 100%; margin-top:10px" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-divider></el-divider>
            <div v-for="(rightItem,index) of props.row.children" :key="rightItem.id">
              <el-row class="d-center">
                <!-- 一级权限 -->
                <el-col :span="4">
                  <el-tag closable @close="deleteTag(props.row,rightItem.id)">{{rightItem.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="20" v-if="rightItem.children">
                  <div v-for="(secondSubItem,index) of rightItem.children" :key="secondSubItem.id">
                    <el-row class="d-center">
                      <el-col :span="4">
                        <el-tag
                          closable
                          @close="deleteTag(props.row,secondSubItem.id)"
                          type="success"
                        >{{secondSubItem.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级权限 -->
                      <el-col :span="20" v-if="secondSubItem.children">
                        <el-tag
                          style="margin:8px"
                          closable
                          @close="deleteTag(props.row,thirdSubItem.id)"
                          type="warning"
                          v-for="(thirdSubItem,index) of secondSubItem.children"
                          :key="thirdSubItem.id"
                        >{{thirdSubItem.authName}}</el-tag>
                      </el-col>
                    </el-row>
                    <el-divider v-if="index!=rightItem.children.length-1"></el-divider>
                  </div>
                </el-col>
              </el-row>
              <el-divider></el-divider>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="380px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="medium">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="medium"
              @click="setRight(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色 树形控件-->
    <!-- 情况，防止每次关闭后叠加当前的，数据不准确 -->
    <el-dialog title="分配权限" 
      :visible.sync="dialogTreeFormVisible" 
      @close="defaultCheckedKeys = []">
      <el-tree
        :data="allRightList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        ref="treeRef"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRight()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogTreeFormVisible: false,
      allRightList: [],
      // 树形控件绑定的属性
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defaultCheckedKeys: [],
      roleId:0,
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      let { data: res } = await this.$axios.get("/roles");
      this.roleList = res.data;
      // console.log(res.data);
    },
    async deleteTag(role, rightId) {
      let result = await this.$confirm(
        "此操作将永久删除该, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result == "confirm") {
        // 数据库删除
        let { data: res } = await this.$axios.delete(
          `/roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status != 200) {
          return this.$message.error("出错了");
        }
        //   界面删除,不请求服务器更新
        role.children = res.data;
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      }
    },
    // 分配权限
    async setRight(role) {
      this.dialogTreeFormVisible = true
      this.roleId = role.id
      // 获取所有权限列表
      let { data: res } = await this.$axios.get("/rights/tree")
      this.allRightList = res.data;
      // 获取用户三级id
      this.getdefaultCheckedKeys(role,this.defaultCheckedKeys)
    },
    // 递归获取选项中
    getdefaultCheckedKeys(node,arr){
      if(!node.children){
           return arr.push(node.id)
      } 
      node.children.forEach( item => {        
        this.getdefaultCheckedKeys(item,arr)
      })
    },
    // 确定
    async confirmSetRight(){
      let keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      let idsStr = keys.join(',')
      console.log(idsStr)
      let {data:res} = await this.$axios.post(`/roles/${this.roleId}/rights`,{rids:idsStr})
      if(res.meta.status != 200){
        return this.$message.error('分配失败')
      }
      this.$message({
        type:'success',
        message:res.meta.msg
      })
      this.dialogTreeFormVisible = false
      this.getRoleList()
    }
  },

  created() {
    this.getRoleList();
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 20px;
}
.el-icon-caret-right {
  margin-left: 5px;
}
.d-center {
  display: flex;
  align-items: center;
}
</style>