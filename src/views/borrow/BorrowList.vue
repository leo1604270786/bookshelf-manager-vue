<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过读者姓名搜索借阅记录"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchBorrow"
            prefix-icon="el-icon-search"
            v-model="borrow.reader.name">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchBorrow">搜索
          </el-button>
          <el-button slot="reference" type="primary" size="mini" style="margin-left: 5px"
                     @click="showAdvanceSearchView"><i
            class="fa fa-lg" :class="advanceSearchViewVisible ? faangledoubleup : faangledoubledown"
            style="margin-right: 5px"></i>高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept="application/vnd.ms-excel"
            action="http://localhost:8080/borrow/import"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText=='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
              <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportBorrows">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddBorrowView">
            添加借阅记录
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
                <el-col :span="4" :offset="1">
                  读者编号：
                  <el-input v-model="borrow.reader.code" size="mini" style="width: 100px"
                            placeholder="读者编号..."></el-input>
                </el-col>
                <el-col :span="5" :offset="1">
                  图书名称：
                  <el-input v-model="borrow.book.name" size="mini" style="width: 180px"
                            placeholder="图书名称..."></el-input>
                </el-col>
                <el-col :span="6" :offset="1">
                  图书编号：
                  <el-input v-model="borrow.book.code" size="mini" style="width: 140px"
                            placeholder="图书编号..."></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="4" :offset="1">
                  借阅状态：
                  <el-select v-model="borrow.status.id" style="width: 110px" size="mini" placeholder="请选择借阅状态">
                    <el-option
                      v-for="s in borrowStatus"
                      :key="s.id"
                      :label="s.value"
                      :value="s.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6" :offset="1">
                  索书号：
                  <el-input v-model="borrow.callNo" size="mini" style="width: 140px"
                            placeholder="索书号..."></el-input>
                </el-col>
                <el-col :span="6">
                  条形码号：
                  <el-input v-model="borrow.propNo" size="mini" style="width: 140px"
                            placeholder="条形码号..."></el-input>
                </el-col>
                <el-col :span="4" :offset="20">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchBorrow">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="borrows"
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
              prop="reader.name"
              fixed
              align="left"
              label="读者姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="reader.code"
              width="80"
              align="left"
              label="读者编号">
            </el-table-column>
            <el-table-column
              prop="book.name"
              label="书名"
              width="140">
            </el-table-column>
            <el-table-column
              prop="book.code"
              width="80"
              align="left"
              label="书籍编号">
            </el-table-column>
            <el-table-column
              prop="propNo"
              width="120"
              align="left"
              label="条形码号">
            </el-table-column>
            <el-table-column
              prop="callNo"
              width="120"
              align="left"
              label="索书号">
            </el-table-column>
            <el-table-column
              prop="book.author"
              label="作者"
              width="140">
            </el-table-column>
            <el-table-column
              prop="book.publisher"
              width="140"
              label="出版社">
            </el-table-column>
            <el-table-column
              prop="location.name"
              width="140"
              label="借阅地点">
            </el-table-column>
            <el-table-column
              width="110"
              align="left"
              label="借阅日期">
              <template slot-scope="scope">{{ scope.row.borrowDate | formatDate}}</template>
            </el-table-column>
            <el-table-column
              width="110"
              align="left"
              label="归还日期"> <!-- scope.row.returnDate | formatDate -->
              <template slot-scope="scope">
                <span v-if="scope.row.returnDate == null">
                  尚未归还
                </span>
                <span v-else>
                  {{ scope.row.returnDate | formatDate}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status.value"
              width="110"
              label="借阅状态">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160">
              <template slot-scope="scope">
                <el-button @click="showEditBorrowView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 30px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 10px" size="mini"
                           @click="deleteBorrow(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="borrows.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyBorrows">批量删除
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
    <el-form :model="borrow" :rules="rules" ref="addBorrowForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 新增/编辑借阅记录对话框 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="75%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="读者编号:" prop="reader.code">
                  <el-input prefix-icon="el-icon-edit" v-model="borrow.reader.code" size="mini" style="width: 140px"
                            placeholder="请输入读者编号"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="图书编号:" prop="book.code">
                  <el-input prefix-icon="el-icon-edit" v-model="borrow.book.code" size="mini" style="width: 160px"
                            placeholder="图书编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="条形码号:" prop="propNo">
                  <el-input prefix-icon="el-icon-edit" v-model="borrow.propNo" size="mini" style="width: 160px"
                            placeholder="条形码号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="索书号:" prop="callNo">
                  <el-input prefix-icon="el-icon-edit" v-model="borrow.callNo" size="mini" style="width: 160px"
                            placeholder="索书号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="借阅日期:" prop="borrowDate">
                  <el-date-picker
                    v-model="borrow.borrowDate"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 140px"
                    type="date"
                    placeholder="借阅日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="归还日期:" prop="returnDate">
                  <el-date-picker
                    v-model="borrow.returnDate"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 140px"
                    type="date"
                    placeholder="归还日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="借阅状态:" prop="status.id">
                  <el-select v-model="borrow.status.id" style="width: 130px" size="mini" placeholder="请选择状态">
                    <el-option
                      v-for="s in borrowStatus"
                      :key="s.id"
                      :label="s.value"
                      :value="s.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="借阅地编号:" prop="location.code">
                  <el-input prefix-icon="el-icon-edit" v-model="borrow.location.code" size="mini" style="width: 100px"
                            placeholder="借阅地编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addBorrow('addBorrowForm')">确 定</el-button>
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
        borrows: [],
        borrowStatus: [], //借阅状态
        cats: [], //分类
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
        borrow: {
          id: '',
          propNo: '',
          callNo: '',
          reader: {
            name: '',
            code: '',
          },
          book: {
            name: '',
            code: '',
            author: '',
            publisher: '',
          },
          borrowDate: '',
          returnDate: '',
          status: {id: '',type:'', value: ''},
          location: {code: '',name: '', shortName: ''},
        },
        rules: {
          borrowDate: [{required: true, message: '必填:借阅日期', trigger: 'blur'}],
          propNo: [{required: true, message: '必填:条形码号', trigger: 'blur'}],
          callNo: [{required: true, message: '必填:索书号', trigger: 'blur'}],
          'reader.code': [{required: true, message: '必填:读者编号', trigger: 'blur'}],
          'book.code': [{required: true, message: '必填:图书编号', trigger: 'blur'}],
          'status.id': [{required: true, message: '必填:借阅状态', trigger: 'blur'}],
          'location.code': [{required: true, message: '必填:借阅地编号', trigger: 'blur'}],
        }
      };
    },
    mounted() {
      this.initData();
      this.loadBorrows();
    },
    methods: {
      initData(){
        //获取借阅状态
        this.getRequest("/dicts?type=borrowStatus").then(resp =>{
          if (resp && resp.status == 200) {
            // console.log(resp.data);
            this.borrowStatus = resp.data;
          }
        })
      },
      fileUploadSuccess(response, file, fileList){
        if (response) {
          this.$message({type: response.status, message: response.message});
        }
        this.loadBorrows();
        this.fileUploadBtnText = '导入数据';
      },
      fileUploadError(err, file, fileList){
        this.$message({type: 'error', message: "导入失败!"});
        this.fileUploadBtnText = '导入数据';
      },
      beforeFileUpload(file){
        this.fileUploadBtnText = '正在导入';
      },
      exportBorrows(){
        window.open(this.baseUrl + "/borrow/export", "_parent");
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyBorrowData();
        this.beginDateScope = '';
        this.loadBorrows();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyBorrowData();
          this.beginDateScope = '';
          this.loadBorrows();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyBorrows(){
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
      deleteBorrow(row){
        this.$confirm('此操作将永久删除这条记录, 是否继续?', '提示', {
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
        this.deleteRequest("/borrow?ids=" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.message});
            _this.loadBorrows();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadBorrows();
        }
      },
      searchBorrow(){
        this.loadBorrows();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadBorrows();
      },
      loadBorrows(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/borrows?pageNum=" + this.currentPage + "&pageSize=" + this.pageSize + "&readername=" + this.borrow.reader.name
        + "&bookname=" + this.borrow.book.name + "&readercode=" + this.borrow.reader.code + "&bookcode=" + this.borrow.book.code
        + "&borrowstatus=" + this.borrow.status.id + "&callNo=" + this.borrow.callNo).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.borrows = data.list;
            _this.totalCount = data.total;
          }
        })
      },
      addBorrow(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.borrow.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/borrow", this.borrow).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBorrowData();
                  _this.loadBorrows();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/borrow", this.borrow).then(resp=> {
                _this.tableLoading = false;
                // console.log(resp);
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBorrowData();
                  _this.loadBorrows();
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
        this.emptyBorrowData();
      },
      showEditBorrowView(row){
        // console.log(row)
        this.isAdd = false;
        this.dialogTitle = "编辑借阅记录";
        this.borrow = row;
        this.dialogVisible = true;
      },
      showAddBorrowView(){
        this.isAdd = true;
        this.dialogTitle = "添加借阅记录";
        this.dialogVisible = true;
      },
      emptyBorrowData(){
        this.borrow = {
          id: '',
          propNo: '',
          callNo: '',
          reader: {
            name: '',
            code: '',
          },
          book: {
            name: '',
            code: '',
            author: '',
            publisher: '',
          },
          borrowDate: '',
          returnDate: '',
          status: {id: '',type:'', value: ''},
          location: {code: '',name: '', shortName: ''},
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
