<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">书架测算与定位系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
    {{user.name}}
    <i><img :src="user.userFace"
            style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><router-link to="/user/profile">个人中心</router-link></el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <el-menu style="background: #ececec;width: 180px;" unique-opened router>
              <el-submenu index="1">
                <template slot="title"><i class="el-icon-user"></i>用户管理</template>
                <el-menu-item-group>
                  <el-menu-item index="/user/list">用户列表</el-menu-item>
                  <el-menu-item index="/user/profile">个人中心</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title"><i class="el-icon-notebook-2"></i>图书管理</template>
                <el-menu-item-group>
                  <el-menu-item index="/book/list">图书列表</el-menu-item>
                  <el-menu-item index="/bookitem/list">复本列表</el-menu-item>
                  <el-menu-item index="/borrow/list">借阅列表</el-menu-item>
                  <el-menu-item index="/book/analysis">统计分析</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title"><i class="el-icon-s-data"></i>书架管理</template>
                <el-menu-item-group>
                  <el-menu-item index="/bookshelf/list">书架列表</el-menu-item>
                  <el-menu-item index="/bookshelf/preview">书架预览</el-menu-item>
                  <el-menu-item index="/bookshelf/measure">书架测算</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!this.$route.meta.keepAlive"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default{
    mounted() {

    },
    methods: {
      handleCommand(cmd){
        var _this = this;
        if (cmd == 'logout') {
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // _this.getRequest("/logout");
            _this.$store.commit('logout');
            _this.$router.replace({path: '/login'});
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }
      }
    },
    data(){
      return {
      }
    },
    computed: {
      user(){
        return this.$store.state.user;
      },
      routes(){
        return this.$store.state.routes
      }
    }
  }
</script>
<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
    overflow-x: hidden;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
  a {
    color: #303133;
  }
</style>
