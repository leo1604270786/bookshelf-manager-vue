<template>
  <div>
    <el-form :rules="lRules" :model="loginForm" ref="loginForm" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">书架测算与定位系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <a @click="showRegistry" alt="注册">没有账号？注册</a> -->
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>

  <el-form :model="user" :rules="rRules" ref="registryForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 注册对话框 -->
        <el-dialog
          title="注册账户"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="80%">
          <el-row>
            <el-col :span="7">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="user.name" size="mini" style="width: 180px"
                            placeholder="请输入用户姓名"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="user.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 10px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7" :offset="2">
              <div>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input prefix-icon="el-icon-phone" v-model="user.phone" size="mini" style="width: 180px"
                            placeholder="电话号码..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <div>
                <el-form-item label="邮箱:" prop="email">
                  <el-input prefix-icon="el-icon-message" v-model="user.email" size="mini" style="width: 180px"
                            placeholder="邮箱..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="身份证号:" prop="idcard">
                  <el-input prefix-icon="el-icon-edit" v-model="user.idcard" size="mini" style="width: 180px"
                            placeholder="身份证号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="工号/编号:" prop="code">
                  <el-input v-model="user.code" size="mini" style="width: 120px"
                            placeholder="员工工号/编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="7">
              <div>
                <el-form-item label="密码:" prop="password">
                  <el-input type="password" v-model="user.password" size="mini" style="width: 180px"
                            placeholder="密码..."></el-input>
                </el-form-item>
              </div>
            </el-col>
             <el-col :span="7">
              <div>
                <el-form-item label="确认密码:" prop="password2">
                  <el-input type="password" v-model="user.password2" size="mini" style="width: 180px"
                            placeholder="确认密码..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="registry('registryForm')">注 册</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>



</template>
<script>
  export default{
    data(){
      return {
        lRules: {
          username: [{required: true, message: '请输入账号', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        checked: true,
        loginForm: {
          username: '',
          password: ''
        },
        loading: false,
        dialogVisible: false,
        user: {
          id: '',
          name: '',
          code: '',
          password: '',
          password2: '',
          gender: '男',
          phone: '',
          email: '',
          idcard: '',
          role: {id: '', type: '', value: ''},
          registryDate: '',
        },
        rRules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          gender: [{required: true, message: '必填:性别', trigger: 'blur'}],
          phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
          email: [{required: true, message: '必填:邮箱', trigger: 'blur'}],
          idcard: [{required: true, message: '必填:身份证号', trigger: 'blur'}],
          password: [{required: true, message: '必填:密码', trigger: 'blur'}],
          password2: [{required: true, message: '必填:确认密码', trigger: 'blur'}],
          code: [{required: true, message: '必填:工号/编号', trigger: 'blur'}],
        }
      }
    },
    methods: {
      registry(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.user.password != this.user.password2){
              this.$message({type: 'error', message: "两次密码不一致"});
              return false;
            }
            this.tableLoading = true;
            this.user.role.id = 6;
            //删除不需要的参数
            delete this.user.password2;
            this.postRequest("/user", this.user).then(resp=> {
              this.tableLoading = false;
              if (resp && resp.status == 200) {
                var data = resp.data;
                this.$message({type: data.status, message: data.message});
                if(data.status == 200){ //注册成功
                  this.dialogVisible = false;
                  this.emptyUserData();
                }
              }
            })
          } else {
            // _this.dialogVisible = false;
            return false;
          }
        });
      },
      showRegistry(){
        this.dialogVisible = true;
      },
      cancel(){
        this.dialogVisible = false;
        this.emptyUserData();
      },
      emptyUserData(){
        this.user = {
          name: '',
          code: '',
          password: '',
          password2: '',
          gender: '',
          phone: '',
          email: '',
          idcard: '',
          role: {id: '',type:'',value:''},
          registryDate: '',
        }
      },
      submitClick() { //登录按钮点击
        var _this = this;
        this.loading = true;
        this.$refs['loginForm'].validate((valid) => { //验证
          if(valid){
            this.postRequest2('/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            }).then(resp=> {
              _this.loading = false;
              if (resp && resp.status == 200) { //正常响应
                var data = resp.data;
                if(data.status == 200){ //验证通过
                  var user = data.data;
                  _this.$store.commit('login', user); //存储用户信息
                  if(user.role == '读者'){
                    _this.$router.replace({path:'/user/home'});
                  }else {
                    _this.$router.replace({path:'/admin/home'});
                  }
                } else {
                  _this.$message({type:'error', message: data.message});
                }
              }
            });
          } else {
            this.loading = false;
            return false;
          }
        });

      },
    }
  }
</script>
<style scoped>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
  a {
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 5px;
  }
</style>
