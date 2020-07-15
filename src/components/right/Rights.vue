<template>
  <div>
    <breadcrumb-header parentItem="权限管理" subItem="权限列表"></breadcrumb-header>
    <!-- 内容 -->
    <el-card class="box-card">
      <el-table :data="rightList" border style="width: 100%; margin-top:10px" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280px"></el-table-column>
        <el-table-column prop="path" label="路径" width="380px"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
             <el-tag v-else type="info">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <el-pagination
        :page-size="2"
        :page-sizes="[1,2,5]"
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
        :current-page="queryInfo.pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            rightList:[]
        }
    },
    methods:{
       async getRightList(){
           let {data : res} = await this.$axios.get('/rights/list')
           this.rightList = res.data
           if(res.meta.status != 200)
            return this.$message.error('获取权限列表失败')
           console.log(res)
        }
    },
    created(){
        this.getRightList()
    }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  margin-top: 20px;
//   .el-pagination{
//       text-align: left;
//     margin: 15px;
//   }
}
</style>