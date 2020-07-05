<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
        <div style="display: inline">
          <el-input
            placeholder="通过书名搜索图书复本"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchBookItem"
            prefix-icon="el-icon-search"
            v-model="bookItem.book.name">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchBookItem">搜索
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
            action="http://localhost:8080/bookitem/import"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError" :disabled="fileUploadBtnText=='正在导入'"
            :before-upload="beforeFileUpload" style="display: inline">
            <el-button size="mini" type="success" :loading="fileUploadBtnText=='正在导入'">
              <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>{{fileUploadBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportBookItems">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddBookItemView">
            添加图书复本
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
                  <el-input v-model="bookItem.book.code" size="mini" style="width: 100px"
                            placeholder="图书编号..."></el-input>
                </el-col>
                <el-col :span="4">
                  索书号：
                  <el-input v-model="bookItem.callNo" size="mini" style="width: 100px"
                            placeholder="索书号..."></el-input>
                </el-col>
                <el-col :span="4">
                  条形码号：
                  <el-input v-model="bookItem.propNo" size="mini" style="width: 100px"
                            placeholder="条形码号..."></el-input>
                </el-col>
                <el-col :span="4">
                  作者：
                  <el-input v-model="bookItem.book.author" size="mini" style="width: 140px"
                            placeholder="作者..."></el-input>
                </el-col>
                <el-col :span="5">
                  出版社：
                  <el-input v-model="bookItem.book.publisher" size="mini" style="width: 140px"
                            placeholder="出版社..."></el-input>
                </el-col>

              </el-row>
              <el-row style="margin-top: 10px">

                <el-col :span="4" :offset="20">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchBookItem">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="bookItems"
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
              prop="book.name"
              fixed
              align="left"
              label="书名"
              width="170">
            </el-table-column>
            <el-table-column
              prop="book.code"
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
              prop="propNo"
              width="150"
              align="left"
              label="条形码号">
            </el-table-column>
            <el-table-column
              prop="book.author"
              label="作者"
              width="150">
            </el-table-column>
            <el-table-column
              prop="book.isbn"
              label="ISBN"
              width="150">
            </el-table-column>
            <el-table-column
              prop="book.publisher"
              width="150"
              label="出版社">
            </el-table-column>
            <el-table-column
              width="90"
              prop="book.publishYear"
              label="出版年份">
            </el-table-column>
            <el-table-column
              prop="inDate"
              width="150"
              label="采购日期">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160">
              <template slot-scope="scope">
                <el-button @click="showEditBookItemView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 30px"
                           size="mini">编辑
                </el-button>
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px 10px" size="mini"
                           @click="deleteBookItem(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="bookItems.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyBookItems">批量删除
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
    <el-form :model="bookItem" :rules="rules" ref="addBookItemForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <!-- 新增/编辑图书复本对话框 -->
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="75%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="索书号:" prop="callNo">
                  <el-input v-model="bookItem.callNo" :disabled="!isAdd" size="mini" style="width: 170px"
                            placeholder="索书号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="条形码号:" prop="propNo">
                  <el-input v-model="bookItem.propNo" :disabled="!isAdd" size="mini" style="width: 170px"
                            placeholder="条形码号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="图书编号:" prop="book.code">
                  <el-input v-model="bookItem.book.code" :disabled="!isAdd" size="mini" style="width: 100px"
                            placeholder="图书编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="采购日期:" prop="inDate">
                  <el-date-picker
                    v-model="bookItem.inDate"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 140px"
                    type="date"
                    placeholder="采购日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="地点编号:" prop="location.code">
                  <el-input v-model="bookItem.location.code" size="mini" style="width: 100px"
                            placeholder="地点编号..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="价格:" prop="price">
                  <el-input v-model="bookItem.price" size="mini" style="width: 100px"
                            placeholder="价格..."></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="状态:" prop="status.id">
                  <el-select v-model="bookItem.status.id" style="width: 130px" size="mini" placeholder="请选择状态">
                    <el-option
                      v-for="s in bookStatus"
                      :key="s.id"
                      :label="s.value"
                      :value="s.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addBookItem('addBookItemForm')">确 定</el-button>
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
        bookItems: [],
        bookStatus: [],
        pageSize: 10,
        fileUploadBtnText: '导入数据',
        faangledoubleup: 'fa-angle-double-up',
        faangledoubledown: 'fa-angle-double-down',
        dialogTitle: '',
        multipleSelection: [],
        totalCount: -1,
        currentPage: 1,
        dialogVisible: false,
        tableLoading: false,
        isAdd: false,
        advanceSearchViewVisible: false,
        bookItem: {
          propNo: '',
          callNo: '',
          price: '',
          inDate: '',
          book:{
            name: '',
            code: '',
            author: '',
            isbn: '',
            publisher: '',
            publishYear: '',
          },
          status:{id:'',type:'',value:''},
          location:{id:'',code:'',name:'',shortName:''}
        },
        rules: {
          'book.code': [{required: true, message: '必填:图书编号', trigger: 'blur'}],
          callNo: [{required: true, message: '必填:索书号', trigger: 'blur'}],
          propNo: [{required: true, message: '必填:条形码号', trigger: 'blur'}],
          price: [{required: true, message: '必填:价格', trigger: 'blur'}],
          'location.code': [{required: true, message: '必填:地点编号', trigger: 'blur'}],
          inDate: [{required: true, message: '必填:采购日期', trigger: 'blur'}],
          'status.id': [{required: true, message: '必填:状态', trigger: 'blur'}],
        }
      };
    },
    mounted() {
      this.initData();
      this.loadBookItems();
    },
    methods: {
      initData(){
        //获取图书复本状态
        this.getRequest("/dicts?type=bookStatus").then(resp =>{
          if (resp && resp.status == 200) {
            this.bookStatus = resp.data;
          }
        })
      },
      fileUploadSuccess(response, file, fileList){
        if (response) {
          this.$message({type: response.status, message: response.message});
        }
        this.loadBookItems();
        this.fileUploadBtnText = '导入数据';
      },
      fileUploadError(err, file, fileList){
        this.$message({type: 'error', message: "导入失败!"});
        this.fileUploadBtnText = '导入数据';
      },
      beforeFileUpload(file){
        this.fileUploadBtnText = '正在导入';
      },
      exportBookItems(){
        window.open(this.baseUrl + "/bookitem/export", "_parent");
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyBookItemData();
        this.loadBookItems();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyItemData();
          this.loadBookItems();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyBookItems(){
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
      deleteBookItem(row){
        this.$confirm('此操作将永久删除该图书复本, 是否继续?', '提示', {
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
        this.deleteRequest("/bookitem?ids=" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.message});
            _this.loadBookItems();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadBookItems();
        }
      },
      searchBookItem(){
        this.loadBookItems();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadBookItems();
      },
      loadBookItems(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/bookitems?pageNum=" + this.currentPage + "&pageSize=" + this.pageSize + "&name=" + this.bookItem.book.name
        + "&author=" + this.bookItem.book.author + "&publisher=" + this.bookItem.book.publisher + "&code="
        + this.bookItem.book.code + "&callNo=" + this.bookItem.callNo + "&propNo=" + this.bookItem.propNo).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.bookItems = data.list;
            _this.totalCount = data.total;
          }
        })
      },
      addBookItem(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.bookItem.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/bookitem", this.bookItem).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookItemData();
                  _this.loadBookItems();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/bookitem", this.bookItem).then(resp=> {
                _this.tableLoading = false;
                // console.log(resp);
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.message});
                  _this.dialogVisible = false;
                  _this.emptyBookItemData();
                  _this.loadBookItems();
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
        this.emptyBookItemData();
      },
      showEditBookItemView(row){
        // console.log(row)
        this.isAdd = false;
        this.dialogTitle = "编辑图书复本";
        this.bookItem = row;
        this.dialogVisible = true;
      },
      showAddBookItemView(){
        this.isAdd = true;
        this.dialogTitle = "添加图书复本";
        this.dialogVisible = true;
      },
      emptyBookItemData(){
        this.bookItem = {
          propNo: '',
          callNo: '',
          price: '',
          book:{
            name: '',
            code: '',
            author: '',
            isbn: '',
            publisher: '',
            publishYear: '',
          },
          status:{id:'',type:'',value:''},
          location:{id:'',code:'',name:'',shortName:''}
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
