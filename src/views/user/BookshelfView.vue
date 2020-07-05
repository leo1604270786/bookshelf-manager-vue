<template>
  <div class="container">
    <el-backtop>
    </el-backtop>
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
            class="fa fa-lg" v-bind:class="[advanceSearchViewVisible ? faangledoubleup : faangledoubledown]"
            style="margin-right: 5px"></i>高级搜索
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
            size="mini"
            style="width: 100%">
            <el-table-column
              prop="name"
              align="left"
              label="书名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="code"
              width="110"
              align="left"
              label="图书编号">
            </el-table-column>
            <el-table-column
              prop="callNo"
              width="160"
              align="left"
              label="索书号">
            </el-table-column>
            <el-table-column
              prop="author"
              label="作者"
              width="160">
            </el-table-column>
            <el-table-column
              prop="isbn"
              label="ISBN"
              width="180">
            </el-table-column>
            <el-table-column
              prop="publisher"
              width="180"
              label="出版社">
            </el-table-column>
            <el-table-column
              width="120"
              prop="publishYear"
              label="出版年份">
            </el-table-column>
            <el-table-column
              width="170"
              prop="category.name"
              label="所属分类">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="130">
              <template slot-scope="scope">
                <el-button @click="showBookshelf(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px 2px 2px -10px"
                           size="mini">定位所在书架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px 2px 20px 2px">
            <el-pagination
              background
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
          <el-select v-model="place" @change="placeChange" style="width: 180px; margin: 0 auto;" size="mini" placeholder="请选择地点">
            <el-option
              v-for="p in places"
              :key="p"
              :label="p"
              :value="p">
            </el-option>
          </el-select>
          <!-- 刷新 -->
          <el-button @click="refreshScene" type="primary" style="margin-left: 5px"
                      size="mini"><i class="el-icon-refresh"></i> 刷新场景
          </el-button>
          <div id="scene" :v-loading="sceneLoading">
          </div>
          <el-form :model="bookshelf" style="margin: 0px;padding: 0px;">
          <div style="text-align: left">
            <!-- 展示书架信息对话框 -->
            <el-dialog
              title="书架详情"
              style="padding: 0px;"
              :close-on-click-modal="false"
              :visible.sync="dialogVisible"
              width="75%">
              <el-row>
                <el-col :span="6">
                  <div>
                    <el-form-item label="架标始:" prop="labelBegin">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.labelBegin" size="mini" style="width: 180px"
                                placeholder="请输入架标始"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="架标末:" prop="labelEnd">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.labelEnd" size="mini" style="width: 140px"
                                placeholder="请输入架标末"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="地点:" prop="place">
                      <el-input disabled prefix-icon="el-icon-office-building" v-model="bookshelf.place" size="mini" style="width: 180px"
                                placeholder="地点..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item label="书籍分类:" prop="category.id">
                        <el-select disabled v-model="bookshelf.category.id" style="width: 150px" size="mini" placeholder="请选择分类">
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
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.initCapacity" size="mini" style="width: 140px"
                                type="number" placeholder="初始容量..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <el-form-item label="剩余容量:" prop="leftCapacity">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.leftCapacity" size="mini" style="width: 140px"
                                type="number" placeholder="剩余容量..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>
                    <el-form-item label="X坐标:" prop="x">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.x" size="mini" style="width: 80px"
                                type="number" placeholder="X坐标..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>
                    <el-form-item label="Y坐标:" prop="y">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.y" size="mini" style="width: 80px"
                                type="number" placeholder="Y坐标..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div>
                    <el-form-item label="Z坐标:" prop="z">
                      <el-input disabled prefix-icon="el-icon-edit" v-model="bookshelf.z" size="mini" style="width: 80px"
                                type="number" placeholder="Z坐标..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <div>
                    <el-form-item label="书架编号:" prop="code">
                      <el-input v-model="bookshelf.code" disabled size="mini" style="width: 100px"
                                placeholder="书架编号..."></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click="dialogVisible = false;">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
  import * as THREE from "three";
  import {OBJLoader, MTLLoader} from 'three-obj-mtl-loader';
  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
  import { Mesh, MeshBasicMaterial, DoubleSide, GridHelper, Raycaster, Vector2, log } from 'three';

  export default {
    data() {
      return {
        scene: '',
        camera: '',
        manager: '',
        controls: '',
        renderer: '',
        material: '',
        fov: 40,
        myObjects: [],
        sceneLoading: false,
        bookshelfs: [], //书架
        books: [],
        cats: [], //分类
        pageSize: 10,
        faangledoubleup: 'fa-angle-double-up',
        faangledoubledown: 'fa-angle-double-down',
        advanceSearchViewVisible: false,
        totalCount: -1,
        currentPage: 1,
        tableLoading: false,
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
        places: [],
        place: '', //地点
        dialogVisible: false
      }
    },
    mounted() {
      this.initData();
      this.init();
    },
    beforeDestroy(){
      this.clearScene();
    },
    methods: {
      initData(){ //加载书架信息
        var _this = this;
        this.sceneLoading = true;
        //获取分类
        this.getRequest("/cats").then(resp =>{
          if (resp && resp.status == 200) {
            // console.log(resp.data);
            this.cats = resp.data;
          }
        })
        this.getRequest("/bookshelfs/places").then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.places = data;
            _this.place = _this.places[0];
          }
        }).then(() => {
          this.refreshScene();
        })
      },
      init() { //初始化场景
        const container = document.getElementById('scene');
        // console.log(window.innerWidth);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF,1));//环境光

        //初始化相机
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 0;
        this.camera.position.x = -1;
        this.camera.position.y = -5;
        this.camera.lookAt(this.scene.position);
        //渲染
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias:true,
        });//会在body里面生成一个canvas标签,

        this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(this.renderer.domElement);

        //初始化控制器
        this.controls = new OrbitControls(this.camera, container);
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = 90;
        this.controls.maxDistance = 120;
        this.controls.maxPolarAngle = Math.PI / 3;
        this.controls.update();
        //初始化平面网格
        const planeBufferGeometry = new THREE.PlaneBufferGeometry();
        const plane = new Mesh(planeBufferGeometry,new MeshBasicMaterial({color: 0XFFFFFF, side: DoubleSide}));
        plane.name = 'plane';
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
        this.scene.add(new GridHelper(500,50));

        //加载管理器
        this.manager = new THREE.LoadingManager();
        window.addEventListener('resize', this.onWindowResize, false);//添加窗口监听事件
        //添加canvas点击事件
        this.renderer.domElement.addEventListener('click', this.onCanvasClick);
        this.sceneLoading = false;
      },
      showBookshelf(row){ //定位书籍所在书架
        // console.log(row);
        this.getRequest("/bookshelf/callNo?callNo=" + row.callNo).then(resp =>{
          if (resp && resp.status == 200) {
            this.bookshelf = resp.data;
            if(this.bookshelf.place != this.place)
              this.placeChange(this.bookshelf.place);
            //查询场景中的模型
            for(let obj of this.myObjects){
              if(obj.userData.id == this.bookshelf.id){
                // console.log(obj);
                let image = new Image()
                image.src = '/static/model/material2.jpg';
                image.onload = function () { //更换模型材质
                    obj.children[0].material.map.image = image;
                    obj.children[0].material.map.needsUpdate = true;
                }
                //锚点跳转
                this.$el.querySelector('#scene').scrollIntoView();
                break;
             }
            }
          }
        })
      },
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyBookData();
        // this.loadBooks();
      },
      showAdvanceSearchView(){
        this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
        this.keywords = '';
        if (!this.advanceSearchViewVisible) {
          this.emptyBookData();
          // this.loadBooks();
        }
      },
      keywordsChange(val){
        if (val != '') {
          this.loadBooks();
        }
      },
      searchBook(){
        if( this.book.name == '' && this.book.author == '' && this.book.publisher == '' && this.book.code == ''
        && this.book.callNo == '' && this.book.category.code == ''){
          this.$message({type: 'warning', message: '请输入查询条件！'});
        } else {
          this.loadBooks();
        }
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
      },
      placeChange(val){
        this.place = val;
        this.refreshScene();
      },
      refreshScene(){
        this.clearScene();
        let _this = this;
        this.getRequest("/bookshelfs/condi?place=" + this.place).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.bookshelfs = data;
              //开始加载
              _this.loadBookshelf();
              _this.animate();
            }
          })
      },
      onCanvasClick(event){ //场景点击事件处理
        const {offsetX, offsetY} = event;
        const x = (offsetX / window.innerWidth) * 2 -1;
        const y = -(offsetY / window.innerHeight) * 2 +1;
        const mousePoint = new Vector2(x,y);
        const raycaster = new Raycaster();
        raycaster.setFromCamera(mousePoint, this.camera);
        //被点击的物体
        const intersects =  raycaster.intersectObjects(this.scene.children, true);
         // 过滤网格和地面
        const intersect = intersects.filter(intersect => !(intersect.object instanceof GridHelper)
        && intersect.object.name !== 'plane')[0];
        if(intersect && this.isClickBookshelf(intersect.object)){ //点击书架
          this.bookshelf = intersect.object.parent.userData;
          // console.log(intersect.object.parent.userData);
          this.dialogVisible = true;
        }

      },
      onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      isClickBookshelf(obj){ //判断是否点击的书架
        if(obj.name === 'bookshelf') {
          return obj;
        } else if(obj.parent) {
          return this.isClickBookshelf(obj.parent);
        } else {
          return null;
        }
      },
      animate() {
        requestAnimationFrame(this.animate);
        this.render();
      },
      render() {
        this.renderer.render(this.scene, this.camera);
      },
      clearScene(){
        // 从scene中删除模型并释放内存
        if(this.myObjects.length > 0){
          for(var i = 0; i< this.myObjects.length; i++){
            var currObj = this.myObjects[i];

            // 判断类型
            if(currObj instanceof THREE.Scene){
              var children = currObj.children;
              for(var i = 0; i< children.length; i++){
                this.deleteGroup(children[i]);
              }
            }else{
              this.deleteGroup(currObj);
            }
            this.scene.remove(currObj);

          }
          this.myObjects.splice(0,this.myObjects.length); //清空数组
        }
      },
      deleteGroup(group){
        if (!group) return;
        // 删除掉所有的模型组内的mesh
        group.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                item.geometry.dispose(); // 删除几何体
                item.material.dispose(); // 删除材质
            }
        });
      },
      loadBookshelf() {
        for(let b of this.bookshelfs){
          //加载书架模型（包含材质）
          new MTLLoader(this.manager).setPath('/static/model/').load('bookshelf.mtl', materials => {
            materials.preload();
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('/static/model/');
            objLoader.load('bookshelf.obj', obj => {
              obj.scale.set(6, 6, 6);
              obj.position.set(b.x, b.y, b.z);
              obj.name = 'bookshelf';
              // console.log(obj);
              obj.userData = b;
              this.myObjects.push(obj);
              this.scene.add(obj);
            });
          });
        }

      },
    }
  }
</script>

<style>
  #scene{
    width: 100%;
    height: 600px;
    margin-top: 20px;
    outline: none;
    overflow:hidden;
  }
  .container{
    margin-top: 30px;
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
