<template>
  <div class="container">
    <h2 class="title">欢迎进入书架测算与定位系统</h2>
    <img :src="bookGit" width="800" height="600" alt="Book Animation.">
    <div class="copy">
      Copyright&copy; 2020 <a href="https://blog.csdn.net/qq_39340792" target="_blank">zys.</a> All rights reserved
    </div>
  </div>
</template>

<script>
import bookGit from '@/assets/bookAnimation2.gif'

export default {
  name: 'Welcome',
  data() {
    return {
      bookGit
    }
  }
}
</script>

<style scoped>
  .container{
    width: 800px;
    margin: 0 auto;
    height: 500px;
    overflow: hidden;
  }
  .title{
    width: 800px;
    text-align: center;
    position: absolute;
    top: 120px;
    right: 275px;
    color: #409EFF;
  }
  .copy{
    width: 800px;
    position: absolute;
    bottom: 20px;
    right: 30px;
    color: #303133;
  }
  .copy a{
    color: #409EFF;
  }
</style>
