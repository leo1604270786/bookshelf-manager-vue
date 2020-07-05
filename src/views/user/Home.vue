<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">书架定位系统</span>
        <el-menu default-active="1" class="nav" mode="horizontal" @select="handleSelect"
        text-color="#fff" background-color="#20a0ff" active-text-color="#FFFFFF">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">个人中心</el-menu-item>
          <el-menu-item index="3">书架定位</el-menu-item>
        </el-menu>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
    {{user.name}}
    <i><img :src="user.userFace"
            style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-container>
          <el-main>
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
    data() {
      return{
        activeIndex: '1',
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
        if(key == '1'){
          this.$router.push({path: '/user/home'});
        } else if (key == '2') {
          this.$router.push({path: '/user/profile2'});
        } else if (key == '3'){
          this.$router.push({path: '/bookshelf/view'});
        }
      },
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
        } else if(cmd == 'profile'){
          this.activeIndex = '2';
          this.$router.push({path: '/user/profile2'});
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
</style>
