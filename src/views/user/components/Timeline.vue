<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item :timestamp="user.registryDate" placement="top">
        <el-card>
          <h4>注册账户</h4>
          <p><span style="color: #67C23A">{{ user.name }}</span> 于 <span style="color: #67C23A">{{user.registryDate}}</span> 注册账户</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          code: '',
          name: '',
          gender: '',
          email: '',
          phone: '',
          idcard: '',
          registryDate: '',
        }
      }
    }
  },
  data() {
    return {

    }
  }
}
</script>
