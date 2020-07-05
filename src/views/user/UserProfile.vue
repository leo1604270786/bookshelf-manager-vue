<template>
  <div class="app-container" style="margin-top: 15px">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="时间戳" name="timeline">
                <timeline :user="user" />
              </el-tab-pane>
              <el-tab-pane label="账户" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  components: { UserCard, Timeline, Account },
  data() {
    return {
      activeTab: 'account'
    }
  },
  computed: {
    user(){
      return this.$store.state.user;
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
