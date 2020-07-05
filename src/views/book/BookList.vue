<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过书名搜索图书"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchBook"
            prefix-icon="el-icon-search"
            v-model="book.name">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchBook">搜索
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
            action="http://localhost:8080/book/import"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText=='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
              <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportBooks">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddBookView">
            添加图书
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
                  图书编号：
                  <el-input v-model="book.code" size="mini" style="width: 100px"
                            placeholder="图书编号..."></el-input>
                </el-col>
                <el-col :span="4">
                  索书号：
                  <el-input v-model="book.callNo" size="mini" style="width: 100px"
                            placeholder="索书号..."></el-input>
                </el-col>
                <el-col :span="4">
                  作者：
                  <el-input v-model="book.author" size="mini" style="width: 140px"
                            placeholder="作者..."></el-input>
                </el-col>
                <el-col :span="5">
                  出版社：
                  <el-input v-model="book.publisher" size="mini" style="width: 140px"
                            placeholder="出版社..."></el-input>
                </el-col>
                <el-col :span="6">
                  所属分类：
                  <el-select v-model="book.category.code" style="width: 180px" size="mini" placeholder="请选择分类">
                    <el-option
                      v-for="c in cats"
                      :key="c.id"
                      :label="c.name"
                      :value="c.code">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">

                <el-col :span="4" :offset="20">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchBook">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="books"
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
              fixed
              align="left"
              label="书名"
              width="170">
            </el-table-column>
            <el-table-column
              prop="code"
              width="80"
              align="left"
              label="图书编号">
            </el-table-column>
            <el-table-column
              prop="callNo"
              width="150"
              align="left"
              label="索书号">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="150">
            </el-table-column>
            <el-table-column
              prop="isbn"
              label="ISBN"
              width="150">
            </el-table-column>
            <el-table-column
              prop="publisher"
              width="150"
              label="出版社">
            </el-table-column>
            <el-table-column
              width="90"
              prop="publishYear"
              label="出版年份">
            </el-table-column>
            <el-table-column
              width="160"
              prop="category.name"
              label="所属分类">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160">
              <template slot-scope="scope">
                <el-button @click="showEditBookView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 30px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 10px" size="mini"
                           @click="deleteBook(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="books.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyBooks">批量删除
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
    <el-form :model="book" :rules="rules" ref="addBookForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 新增/编辑图书对话框 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="75%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="书名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="book.name" size="mini" style="width: 170px"
                            placeholder="请输入书名"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="作者:" prop="author">
                  <el-input prefix-icon="el-icon-edit" v-model="book.author" size="mini" style="width: 140px"
                            placeholder="请输入作者"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="ISBN:" prop="isbn">
                  <el-input prefix-icon="el-icon-edit" v-model="book.isbn" size="mini" style="width: 170px"
                            placeholder="ISBN..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="出版社:" prop="publisher">
                  <el-input prefix-icon="el-icon-office-building" v-model="book.publisher" size="mini" style="width: 170px"
                            placeholder="出版社..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="出版年份:" prop="publishYear">
                  <el-date-picker
                    v-model="book.publishYear"
                    size="mini"
                    style="width: 140px"
                    type="year"
                    placeholder="出版年份">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="索书号:" prop="callNo">
                  <el-input v-model="book.code" :disabled="!isAdd" size="mini" style="width: 170px"
                            placeholder="索书号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <el-form-item label="编号:" prop="code">
                  <el-input v-model="book.code" :disabled="!isAdd" size="mini" style="width: 100px"
                            placeholder="图书编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addBook('addBookForm')">确 定</el-button>
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
        books: [],
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
        book: {
          id: '',
          name: '',
          code: '',
          callNo: '',
          author: '',
          isbn: '',
          publisher: '',
          publishYear: '',
          category: {id:'',code:'',name:''},
        },
        rules: {
          name: [{required: true, message: '必填:书名', trigger: 'blur'}],
          code: [{required: true, message: '必填:图书编号', trigger: 'blur'}],
          callNo: [{required: true, message: '必填:索书号', trigger: 'blur'}],
          author: [{required: true, message: '必填:作者', trigger: 'blur'}],
          publisher: [{required: true, message: '必填:出版社', trigger: 'blur'}],
          publishYear: [{required: true, message: '必填:出版年份', trigger: 'blur'}],
        }
      };
    },
    mounted() {
      this.initData();
      this.loadBooks();
    },
    methods: {
      initData(){
        //获取分类
        this.getRequest("/cats").then(resp =>{
          if (resp && resp.status == 200) {
            this.cats = resp.data;
          }
        })
      },
      fileUploadSuccess(response, file, fileList){
        if (response) {
          this.$message({type: response.status, message: response.message});
        }
        this.loadBooks();
        this.fileUploadBtnText = '导入数据';
      },
      fileUploadError(err, file, fileList){
        this.$message({type: 'error', message: "导入失败!"});
        this.fileUploadBtnText = '导入数据';
      },
      beforeFileUpload(file){
        this.fileUploadBtnText = '正在导入';
      },
      exportBooks(){
        window.open(this.baseUrl + "/book/export", "_parent");
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyBookData();
        this.beginDateScope = '';
        this.loadBooks();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyBookData();
          this.beginDateScope = '';
          this.loadBooks();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyBooks(){
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
      deleteBook(row){
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
        this.deleteRequest("/book?ids=" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.message});
            _this.loadBooks();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadBooks();
        }
      },
      searchBook(){
        this.loadBooks();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadBooks();
      },
      loadBooks(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/books?pageNum=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + this.book.name
        + "&author=" + this.book.author + "&publisher=" + this.book.publisher + "&code="
        + this.book.code + "&callNo=" + this.book.callNo + "&categoryCode=" + this.book.category.code).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.books = data.list;
            _this.totalCount = data.total;
          }
        })
      },
      addBook(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.book.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/book", this.book).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookData();
                  _this.loadBooks();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/book", this.book).then(resp=> {
                _this.tableLoading = false;
                // console.log(resp);
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookData();
                  _this.loadBooks();
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
        this.emptyBookData();
      },
      showEditBookView(row){
        // console.log(row)
        this.isAdd = false;
        this.dialogTitle = "编辑图书";
        this.book = row;
        this.dialogVisible = true;
      },
      showAddBookView(){
        this.isAdd = true;
        this.dialogTitle = "添加图书";
        this.dialogVisible = true;
      },
      emptyBookData(){
        this.book = {
          name: '',
          code: '',
          callNo: '',
          author: '',
          isbn: '',
          publisher: '',
          publishYear: '',
          category: {id:'',code:'',name:''},
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
