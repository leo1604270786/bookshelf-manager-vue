<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过姓名搜索用户"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchUser"
            prefix-icon="el-icon-search"
            v-model="user.name">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchUser">搜索
          </el-button>
          <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                     @click="showAdvanceSearchView"><i
            class="fa fa-lg" v-bind:class="advanceSearchViewVisible ? faangledoubleup : faangledoubledown"
            style="margin-right: 5px"></i>高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept="application/vnd.ms-excel"
            action="http://localhost:8080/user/import"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText=='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
              <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportUsers">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddUserView">
            添加用户
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <!-- 高级搜索 -->
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
              v-show="advanceSearchViewVisible">
              <el-row>
                <el-col :span="5" :offset="1">
                  角色:
                  <el-select v-model="user.role.id" style="width: 130px" size="mini" placeholder="请选择角色">
                    <el-option
                      v-for="r in roles"
                      :key="r.id"
                      :label="r.value"
                      :value="r.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  性别:
                  <el-radio-group v-model="user.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 5px" label="女">女</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="5">
                  工号/编号：
                  <el-input v-model="user.code" size="mini" style="width: 150px"
                            placeholder="工号/编号..."></el-input>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchUser">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="users"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="left"
              width="40">
            </el-table-column>
            <el-table-column
              prop="name"
              align="left"
              label="姓名"
              width="90">
            </el-table-column>
            <el-table-column
              prop="code"
              width="85"
              align="left"
              label="工号/编号">
            </el-table-column>
            <el-table-column
              prop="gender"
              label="性别"
              width="50">
            </el-table-column>
            <el-table-column
              prop="role.value"
              label="角色"
              width="70">
            </el-table-column>
            <el-table-column
              prop="phone"
              width="120"
              label="电话号码">
            </el-table-column>
            <el-table-column
              prop="email"
              width="150"
              label="邮箱">
            </el-table-column>
            <el-table-column
              prop="idcard"
              width="180"
              label="身份证号">
            </el-table-column>
            <el-table-column
              width="120"
              align="left"
              label="注册日期">
              <template slot-scope="scope">{{ scope.row.registryDate | formatDate}}</template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="240">
              <template slot-scope="scope">
                <el-button @click="showEditUserView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 30px"
                           size="mini">编辑
                </el-button>
                <el-tooltip effect="light" content="默认密码为：123" placement="top">
                   <el-button @click="resetPwd(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px" type="warning"
                           size="mini">重置密码
                  </el-button>
                </el-tooltip>

                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 10px" size="mini"
                           @click="deleteUser(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="users.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyUsers">批量删除
            </el-button>
            <el-pagination
              background
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form :model="user" :rules="rules" ref="addUserForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 新增/编辑用户对话框 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="80%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="user.name" size="mini" style="width: 140px"
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
            <el-col :span="7">
              <div>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input prefix-icon="el-icon-phone" v-model="user.phone" size="mini" style="width: 180px"
                            placeholder="电话号码..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="角色:" prop="role.id">
                  <el-select v-model="user.role.id" style="width: 130px" size="mini" placeholder="请选择角色">
                    <el-option
                      v-for="r in roles"
                      :key="r.id"
                      :label="r.value"
                      :value="r.id">
                    </el-option>
                  </el-select>
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
            <el-col :span="8">
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
                  <el-input v-model="user.code" :disabled="!isAdd" size="mini" style="width: 120px"
                            placeholder="员工工号/编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="isAdd">
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
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addUser('addUserForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: 'http://localhost:8080',
        users: [],
        roles: [],
        pageSize: 10,
        fileUploadBtnText: '导入数据',
        beginDateScope: '',
        faangledoubleup: 'fa-angle-double-up',
        faangledoubledown: 'fa-angle-double-down',
        dialogTitle: '',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        totalCount: -1,
        currentPage: 1,
        dialogVisible: false,
        tableLoading: false,
        isAdd: false,
        advanceSearchViewVisible: false,
        user: {
          id: '',
          name: '',
          code: '',
          password: '',
          password2: '',
          gender: '',
          phone: '',
          email: '',
          idcard: '',
          role: {id: '', type: '', value: ''},
          registryDate: '',
        },
        rules: {
          name: [{required: true, message: '必填:姓名', trigger: 'blur'}],
          gender: [{required: true, message: '必填:性别', trigger: 'blur'}],
          phone: [{required: true, message: '必填:电话号码', trigger: 'blur'}],
          email: [{required: true, message: '必填:邮箱', trigger: 'blur'}],
          idcard: [{required: true, message: '必填:身份证号', trigger: 'blur'}],
          password: [{required: true, message: '必填:密码', trigger: 'blur'}],
          password2: [{required: true, message: '必填:确认密码', trigger: 'blur'}],
          role: [{required: true, message: '必填:角色', trigger: 'blur'}],
          code: [{required: true, message: '必填:工号/编号', trigger: 'blur'}],
        }
      };
    },
    mounted() {
      this.initData();
      this.loadUsers();
    },
    methods: {
      initData(){
        this.getRequest("/dicts?type=userType").then(resp => {
          if(resp && resp.status == 200){
            this.roles = resp.data;
          }
        })
      },
      fileUploadSuccess(response, file, fileList){
        if (response) {
          this.$message({type: response.status, message: response.message});
        }
        this.loadUsers();
        this.fileUploadBtnText = '导入数据';
      },
      fileUploadError(err, file, fileList){
        this.$message({type: 'error', message: "导入失败!"});
        this.fileUploadBtnText = '导入数据';
      },
      beforeFileUpload(file){
        this.fileUploadBtnText = '正在导入';
      },
      exportUsers(){
        window.open(this.baseUrl + "/user/export", "_parent");
      },
      resetPwd(row){
        let _this = this;
        this.$confirm('此操作将重置用户[' + row.name + ']的密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/user/pwd?id=" + row.id).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.$message({type: data.status, message: data.message});
            }
          })
        }).catch(() => {
        });
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyUserData();
        this.beginDateScope = '';
        this.loadUsers();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyUserData();
          this.beginDateScope = '';
          this.loadUsers();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyUsers(){
        this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = '';
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        }).catch(() => {
        });
      },
      deleteUser(row){
        this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
        });
      },
      doDelete(ids){
        this.tableLoading = true;
        var _this = this;
        this.deleteRequest("/user?ids=" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.message});
            _this.loadUsers();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadUsers();
        }
      },
      searchUser(){
        this.loadUsers();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadUsers();
      },
      loadUsers(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/users?pageNum=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + this.user.name
        + "&gender=" + this.user.gender + "&role=" + this.user.role.id + "&code=" + this.user.code).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.users = data.list;
            _this.totalCount = data.total;
          }
        })
      },
      addUser(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.user.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/user", this.user).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyUserData();
                  _this.loadUsers();
                }
              })
            } else {
              //添加
              if(this.user.password != this.user.password2){
                this.$message({type: 400, message: "两次密码不一致"});
                return false;
              }
              this.tableLoading = true;
              //删除不需要的参数
              delete this.user.password2;
              this.postRequest("/user", this.user).then(resp=> {
                _this.tableLoading = false;
                // console.log(resp);
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyUserData();
                  _this.loadUsers();
                }
              })
            }
          } else {
            // _this.dialogVisible = false;
            return false;
          }
        });
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.emptyUserData();
      },
      showEditUserView(row){
        // console.log(row)
        this.isAdd = false;
        this.dialogTitle = "编辑用户";
        this.user = row;
        this.dialogVisible = true;
      },
      showAddUserView(){
        this.isAdd = true;
        this.dialogTitle = "添加用户";
        this.dialogVisible = true;
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
      }
    }
  };
</script>
<style>
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
