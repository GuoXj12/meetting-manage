<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      background-color="#545c64"
      text-color="#B0B3B2"
      active-text-color="#ffffff"
      default-active="2"
      router
      :collapse="collapse"
    >
      <el-menu-item index="info">
        <el-icon><Document /></el-icon>
        <span>系统首页</span>
      </el-menu-item>
      <el-menu-item index="meeting">
        <el-icon><Document /></el-icon>
        <span>会议管理</span>
      </el-menu-item>
      <el-menu-item index="weekly">
        <el-icon><Document /></el-icon>
        <span>周报管理</span>
      </el-menu-item>
      <el-menu-item index="songList">
        <el-icon><Document /></el-icon>
        <span>人员管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Document } from "@element-plus/icons-vue";
import emitter from "@/utils/emitter";

const collapse = ref(false);
emitter.on("collapse", (msg) => {
  collapse.value = msg;
});
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  background-color: #000000;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
.sidebar > ul {
  height: 100%;
}
</style>
