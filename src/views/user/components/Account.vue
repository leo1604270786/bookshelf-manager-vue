<template>
  <el-form>
    <el-form-item label="编号/工号">
      <el-input v-model.trim="user.code" disabled/>
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.gender">
        <el-radio label="男">男</el-radio>
        <el-radio style="margin-left: 10px" label="女">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="user.phone" />
    </el-form-item>
    <el-form-item label="身份证号">
      <el-input v-model.trim="user.idcard" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
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
        }
      }
    }
  },
  methods: {
    submit() {
      let _this = this;
      //更新
      this.putRequest("/user/base", this.user).then(resp=> {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$message({type: data.status, message: data.message});
        }
      })
    }
  }
}
</script>
