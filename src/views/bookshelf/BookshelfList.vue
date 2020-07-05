<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddBookshelfView">
            添加书架
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-table
            :data="bookshelfs"
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
              prop="code"
              fixed
              width="85"
              align="left"
              label="书架编号">
            </el-table-column>
            <el-table-column
              prop="labelBegin"
              align="left"
              label="架标始"
              width="120">
            </el-table-column>
            <el-table-column
              prop="labelEnd"
              width="120"
              align="left"
              label="架标末">
            </el-table-column>
            <el-table-column
              prop="category.name"
              width="160"
              label="书籍分类">
            </el-table-column>
            <el-table-column
              prop="place"
              label="地点"
              width="150">
            </el-table-column>
            <el-table-column
              prop="initCapacity"
              label="初始容量(格)"
              width="120">
            </el-table-column>
            <el-table-column
              prop="leftCapacity"
              width="120"
              label="剩余容量(格)">
            </el-table-column>
            <el-table-column
              prop="x"
              width="60"
              label="X坐标">
            </el-table-column>
            <el-table-column
              prop="y"
              width="60"
              label="Y坐标">
            </el-table-column>
            <el-table-column
              prop="z"
              width="60"
              label="Z坐标">
            </el-table-column>
            <el-table-column
              width="110"
              align="left"
              label="更新日期">
              <template slot-scope="scope">{{ scope.row.updateDate | formatDate}}</template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160">
              <template slot-scope="scope">
                <el-button @click="showEditBookshelfView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 30px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 10px" size="mini"
                           @click="deleteBookshelf(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="bookshelfs.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyBookshelfs">批量删除
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
    <el-form :model="bookshelf" :rules="rules" ref="addBookshelfForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 新增/编辑书架对话框 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="75%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="架标始:" prop="labelBegin">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.labelBegin" size="mini" style="width: 180px"
                            placeholder="请输入架标始"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="架标末:" prop="labelEnd">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.labelEnd" size="mini" style="width: 140px"
                            placeholder="请输入架标末"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="地点:" prop="place">
                  <el-input prefix-icon="el-icon-office-building" v-model="bookshelf.place" size="mini" style="width: 180px"
                            placeholder="地点..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="书籍分类:" prop="category.id">
                  <el-select v-model="bookshelf.category.id" style="width: 150px" size="mini" placeholder="请选择分类">
                    <el-option
                      v-for="c in cats"
                      :key="c.id"
                      :label="c.name"
                      :value="c.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="初始容量:" prop="initCapacity">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.initCapacity" size="mini" style="width: 140px"
                            type="number" placeholder="初始容量..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="剩余容量:" prop="leftCapacity">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.leftCapacity" size="mini" style="width: 140px"
                            type="number" placeholder="剩余容量..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="X坐标:" prop="x">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.x" size="mini" style="width: 80px"
                            type="number" placeholder="X坐标..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="Y坐标:" prop="y">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.y" size="mini" style="width: 80px"
                            type="number" placeholder="Y坐标..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="Z坐标:" prop="z">
                  <el-input prefix-icon="el-icon-edit" v-model="bookshelf.z" size="mini" style="width: 80px"
                            type="number" placeholder="Z坐标..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="书架编号:" prop="code">
                  <el-input v-model="bookshelf.code" :disabled="!isAdd" size="mini" style="width: 100px"
                            placeholder="书架编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addBookshelf('addBookshelfForm')">确 定</el-button>
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
        bookshelfs: [],
        cats: [], //分类
        pageSize: 10,
        dialogTitle: '',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        totalCount: -1,
        currentPage: 1,
        dialogVisible: false,
        tableLoading: false,
        isAdd: false,
        bookshelf: {
          id: '',
          code: '',
          labelBegin: '',
          labelEnd: '',
          place: '',
          initCapacity: '',
          leftCapacity: '',
          x: '',
          y: '',
          z: '',
          updateDate: '',
          category: {id: '', code: '', name: ''},
        },
        rules: {
          code: [{required: true, message: '必填:书架编号', trigger: 'blur'}],
          labelBegin: [{required: true, message: '必填:架标始', trigger: 'blur'}],
          labelEnd: [{required: true, message: '必填:架标末', trigger: 'blur'}],
          place: [{required: true, message: '必填:地点', trigger: 'blur'}],
          initCapacity: [{required: true, message: '必填:初始容量', trigger: 'blur'}],
          leftCapacity: [{required: true, message: '必填:剩余容量', trigger: 'blur'}],
          x: [{required: true, message: '必填:X坐标', trigger: 'blur'}],
          y: [{required: true, message: '必填:Y坐标', trigger: 'blur'}],
          z: [{required: true, message: '必填:Z坐标', trigger: 'blur'}],
          'category.id': [{required: true, message: '必填:书籍分类', trigger: 'blur'}],
        }
      };
    },
    mounted() {
      this.initData();
      this.loadBookshelfs();
    },
    methods: {
      initData(){
        //获取分类
        this.getRequest("/cats").then(resp =>{
          if (resp && resp.status == 200) {
            // console.log(resp.data);
            this.cats = resp.data;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyBookshelfs(){
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
      deleteBookshelf(row){
        this.$confirm('此操作将永久删除书架[' + row.code + '], 是否继续?', '提示', {
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
        this.deleteRequest("/bookshelf?ids=" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.message});
            _this.loadBookshelfs();
          }
        })
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadBookshelfs();
      },
      loadBookshelfs(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/bookshelfs?pageNum=" + this.currentPage + "&pageSize=" + this.pageSize).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.bookshelfs = data.list;
            _this.totalCount = data.total;
          }
        })
      },
      addBookshelf(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.bookshelf.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/bookshelf", this.bookshelf).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookshelfData();
                  _this.loadBookshelfs();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/bookshelf", this.bookshelf).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookshelfData();
                  _this.loadBookshelfs();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.emptyBookshelfData();
      },
      showEditBookshelfView(row){
        // console.log(row)
        this.isAdd = false;
        this.dialogTitle = "编辑书架";
        this.bookshelf = row;
        this.dialogVisible = true;
      },
      showAddBookshelfView(){
        this.isAdd = true;
        this.dialogTitle = "添加书架";
        this.dialogVisible = true;
      },
      emptyBookshelfData(){
        this.bookshelf = {
          id: '',
          code: '',
          labelBegin: '',
          labelEnd: '',
          place: '',
          initCapacity: '',
          leftCapacity: '',
          x: '',
          y: '',
          z: '',
          updateDate: '',
          category: {id: '', code: '', name: ''},
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
