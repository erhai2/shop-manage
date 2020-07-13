<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{parentItem}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{subItem}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props:{
        parentItem:{
            type:String
        },
        subItem:{
            type:String
        }
    }
}
</script>

<style>
</style>