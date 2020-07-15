<template>
  <div>
    <breadcrumb-header parentItem="用户管理" subItem="用户列表"></breadcrumb-header>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogAddUserFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border style="width: 100%; margin-top:10px" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="130px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="toggleState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getUserInfo(scope.row.id)"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletUser(scope.row.id)"
              style="margin-right:15px"
            ></el-button>

            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
                @click="allocateRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :page-size="2"
        :page-sizes="[1,2,5]"
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
        :current-page="queryInfo.pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUserFormVisible">
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef">
        <el-form-item label="用户名" :label-width="addFormLabelWidth" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="addFormLabelWidth" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="addFormLabelWidth" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="addFormLabelWidth" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off" type="tel"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户" :visible.sync="dialogEditUserFormVisible" width="40%">
      <el-form
        :model="editUserForm"
        :rules="addUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off" type="tel"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" 
      :visible.sync="dialogAllocateRoleFormVisible"
      width="40%"
      @close="roleValue='';user={}">
      <p>当前用户：{{user.username}}</p>
      <p>当前角色:{{user.role_name}}</p>
      <el-select v-model="roleValue" placeholder="请选择">
        <el-option
          v-for="role in roleList"
          :key="role.id"
          :label="role.roleName"
          :value="role.id"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAllocateRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAllocate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证电话号码
    var validateTel = (rule, value, callback) => {
      let regTel = /^1[3,4,5,7,8][0-9]{9}$/;
      if (regTel.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    // 验证邮箱
    var validateEmail = (rule, value, callback) => {
      let regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      //   总页数
      total: 0,
      centerDialogVisible: false,
      // 搜索框
      searchValue: "",
      // 添加用户对话框
      dialogAddUserFormVisible: false,
      dialogEditUserFormVisible: false,
      addUserForm: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      editUserForm: {},
      addFormLabelWidth: "120px",
      // 规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名在3-10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "请输入6-15个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: validateTel, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ]
      },
      dialogAllocateRoleFormVisible: false,
      roleValue:'',
      user:{},
      roleList:[]
    };
  },
  methods: {
    async getUserList() {
      let { data: res } = await this.$axios.get("/users", {
        params: this.queryInfo
      });
      if (res.meta.status == 200) {
        this.userList = res.data.users;
        // console.log(this.userList)
        this.total = res.data.total;
      }
    },
    // 每页显示的数量
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    // 修改用户状态
    async toggleState(userInfo) {
      let { id, mg_state } = userInfo;
      let { data: res } = await this.$axios.put(
        `/users/${id}/state/${mg_state}`
      );
      if (res.meta.status != 200) {
        // 还原页面状态
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("修改用户信息失败");
      }
    },
    addUser() {
      // 预校验
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return false;
        let { data: res } = await this.$axios.post("/users", this.addUserForm);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message({
          type: "success",
          message: res.meta.msg
        });
        // 关闭弹窗
        this.dialogAddUserFormVisible = false;
        // 更新表格数据
        this.getUserList();
      });
    },
    async getUserInfo(id) {
      // 显示对话框
      this.dialogEditUserFormVisible = true;
      // 表单填值
      let { data: res } = await this.$axios.get(`/users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("查询用户失败");
      }
      this.editUserForm = res.data;
    },
    editUser() {
      // 修改
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return false;
        let { data: result } = await this.$axios.put(
          `/users/${this.editUserForm.id}`,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        );
        //  console.log(result)
        if (result.meta.status != 200) {
          this.$message.error("修改用户失败");
        }
        this.dialogEditUserFormVisible = false;
        this.$message({
          type: "success",
          message: result.meta.msg
        });
        this.getUserList();
      });
    },
    // 重置
    cancelEdit() {
      this.dialogEditUserFormVisible = false;
      this.$refs.editUserFormRef.resetFields();
    },
    // 弹出删除消息框
    deletUser(userId) {
      this.$confirm("此操作将永久删除该, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 请求接口
          let { data: res } = await this.$axios.delete("/users/" + userId);
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.meta.msg
            });
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配角色
      async allocateRole(user) {
      this.dialogAllocateRoleFormVisible = true;
      this.user = user
      let{data:res} = await this.$axios.get('/roles')
      this.roleList = res.data
    },
    async confirmAllocate(){
      // console.log(this.roleValue)
      let {data:res} = await this.$axios.put(`/users/${this.user.id}/role`,{rid:this.roleValue})
      if(res.meta.status != 200){
        return this.$message.error('分配角色失败')
      }
      this.$message({
        type:'success',
        message:res.meta.msg
      })
      this.getUserList()
      this.dialogAllocateRoleFormVisible = false
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  margin-top: 20px;
  .el-pagination {
    text-align: left;
    margin: 15px;
  }
}
</style>