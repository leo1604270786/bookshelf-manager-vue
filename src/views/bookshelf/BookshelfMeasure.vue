<template>
  <div>
    <el-backtop>
    </el-backtop>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-tag class="tabTitle">表1 近五年前湖流通书库新书量分类统计及预测</el-tag>
          <el-table
            :data="newBookTrend"
            v-loading="newBookLoading"
            border
            stripe
            height="350"
            size="mini"
            style="width: 100%; margin-bottom: 10px;">
            <el-table-column
              prop="category.code"
              align="left"
              label="分类编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="category.name"
              width="190"
              align="left"
              label="分类名称">
            </el-table-column>
            <el-table-column
              align="center"
              label="数量/册">
              <el-table-column
                prop="year1.count"
                width="160"
                align="left"
                label="2015年">
              </el-table-column>
              <el-table-column
                prop="year2.count"
                width="160"
                align="left"
                label="2016年">
              </el-table-column>
              <el-table-column
                prop="year3.count"
                width="160"
                align="left"
                label="2017年">
              </el-table-column>
              <el-table-column
                prop="year4.count"
                width="160"
                align="left"
                label="2018年">
              </el-table-column>
              <el-table-column
                prop="year5.count"
                width="160"
                align="left"
                label="2019年">
              </el-table-column>
              <el-table-column
                prop="avg"
                label="估算年平均新书量"
                width="160">
              </el-table-column>
            </el-table-column>
          </el-table>

          <el-tag class="tabTitle">表2 近五年前湖流通书库借阅量分类统计及预测</el-tag>
          <el-table
            :data="borrowTrend"
            v-loading="borrowLoading"
            border
            stripe
            height="350"
            size="mini"
            style="width: 100%; margin-bottom: 10px;">
            <el-table-column
              prop="category.code"
              align="left"
              label="分类编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="category.name"
              width="190"
              align="left"
              label="分类名称">
            </el-table-column>
            <el-table-column
              align="center"
              label="借阅量/次">
              <el-table-column
                prop="year1.count"
                width="160"
                align="left"
                label="2015年">
              </el-table-column>
              <el-table-column
                prop="year2.count"
                width="160"
                align="left"
                label="2016年">
              </el-table-column>
              <el-table-column
                prop="year3.count"
                width="160"
                align="left"
                label="2017年">
              </el-table-column>
              <el-table-column
                prop="year4.count"
                width="160"
                align="left"
                label="2018年">
              </el-table-column>
              <el-table-column
                prop="year5.count"
                width="160"
                align="left"
                label="2019年">
              </el-table-column>
              <el-table-column
                prop="avg"
                label="估算年平均借阅量"
                width="160">
              </el-table-column>
            </el-table-column>
          </el-table>

          <el-tag class="tabTitle">表3 前湖流通书库架位分配表</el-tag>
          <el-table
            :data="bookshelfTable"
            v-loading="btLoading"
            border
            stripe
            height="350"
            size="mini"
            style="width: 100%; margin-bottom: 10px;">
            <el-table-column
              prop="category.code"
              align="left"
              label="分类编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="category.name"
              width="190"
              align="left"
              label="分类名称">
            </el-table-column>
            <el-table-column
              prop="count"
              width="160"
              align="left"
              label="册数">
            </el-table-column>
            <el-table-column
              prop="newBookCount"
              width="160"
              align="left"
              label="估算年均新书量">
            </el-table-column>
            <el-table-column
              prop="borrowCount"
              width="160"
              align="left"
              label="估算年均借阅量">
            </el-table-column>
            <el-table-column
              prop="theoryDist"
              width="160"
              align="left"
              label="理论分配架位/架">
            </el-table-column>
            <el-table-column
              prop="theoryPre"
              width="160"
              align="left"
              label="理论预留架位/架">
            </el-table-column>
            <el-table-column
              prop="resultDist"
              label="应分配架位/架"
              width="160">
            </el-table-column>
          </el-table>

          <el-tag class="tabTitle">表4 前湖流通书库点位书架分布表</el-tag>
          <el-table
            :data="bookshelfCatTable"
            v-loading="btCatLoading"
            border
            stripe
            height="350"
            size="mini"
            style="width: 100%; margin-bottom: 10px;">
            <el-table-column
              prop="catCode"
              align="left"
              label="分类编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="category"
              width="190"
              align="left"
              label="分类名称">
            </el-table-column>
            <el-table-column
              prop="bookshelves"
              width="960"
              align="left"
              label="占用书架">
            </el-table-column>
          </el-table>

          <el-tag class="tabTitle">上述表格重要列相关解释</el-tag>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="估算年均新书量" name="1">
              <div>通过往年新书量数据，建立线性趋势模型：f(x) = ax + b,x = ...15,16,17,18,19。 x为年份后两位。</div>
              <div>在得出线性趋势模型后，预测未来三年新书量求平均，作为估算年均新书量。</div>
            </el-collapse-item>
            <el-collapse-item title="估算年均借阅量" name="2">
              <div>通过往年借阅量（未还）数据，建立线性趋势模型：f(x) = ax + b,x = ...15,16,17,18,19。 x为年份后两位。</div>
              <div>在得出线性趋势模型后，预测未来三年借阅量求平均，作为估算年均借阅量。</div>
            </el-collapse-item>
            <el-collapse-item title="理论分配架位" name="3">
              <div>理论分配架位 = 册数/国家标准书架容量</div>
              <div>据《图书馆建筑设计规范》(JGJ 3899) 指出：国家标准书架容量：中文科技图书 460册/架, 外文科技图书 340册/架。</div>
              <div>本系统将图书都视为中文科技图书进行计算。</div>
            </el-collapse-item>
            <el-collapse-item title="理论预留架位" name="4">
              <div>理论预留架位 = (年均新书量-年均借阅量*图书遗失率)/国家标准书架容量</div>
              <div>图书遗失率没有国家标准，但根据查询资料得出，图书馆图书遗失率大多为2%-5%。</div>
              <div>本系统使用2%作为图书遗失率进行计算。</div>
            </el-collapse-item>
            <el-collapse-item title="应分配架位" name="5">
              <div>应分配架位 = 理论分配架位 + 理论预留架位</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      newBookTrend: [],
      borrowTrend: [],
      bookshelfTable: [],
      bookshelfCatTable: [],
      newBookLoading: false,
      borrowLoading: false,
      btLoading: false,
      btCatLoading: false,
      activeNames: ['1'],
    }
  },
  mounted(){
    this.initData();
  },
  methods: {
    initData(){
      this.newBookLoading = true;
      this.getRequest("/book/trend/newbook").then(resp => {
        if(resp && resp.status == 200){
          this.newBookTrend = resp.data;
          this.newBookLoading = false;
        }
      })
      this.borrowLoading = true;
      this.getRequest("/borrow/trend").then(resp => {
        if(resp && resp.status == 200){
          this.borrowTrend = resp.data;
          this.borrowLoading = false;
        }
      })
      this.btLoading = true;
      this.btCatLoading = true;
      this.getRequest("/bookshelf/dist").then(resp => {
        if(resp && resp.status == 200){
          this.bookshelfTable = resp.data;
          this.btLoading = false;
        }
      }).then(() => {
        this.getRequest("/bookshelf/cat").then(resp => {
          if(resp && resp.status == 200){
            this.bookshelfCatTable = resp.data;
            this.btCatLoading = false;
          }
        })
      })
    },
    handleChange(val) {
      // console.log(val);
    }
  }
}
</script>

<style scoped>
  .tabTitle{
    margin-bottom: 10px;
  }
</style>

