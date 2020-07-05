<template>
  <div>
    <el-backtop>
    </el-backtop>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <panel-group />
          <div id="categoryCount">

          </div>
          <el-row>
            <el-col :span="12">
              <div id="bookCount">

              </div>
            </el-col>
            <el-col :span="12">
              <div id="borrowCount">

              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-select v-model="year" @change="yearChange" style="width: 100px;" size="mini" placeholder="请选择年份">
                <el-option
                  v-for="y in years"
                  :key="y"
                  :label="y"
                  :value="y">
                </el-option>
              </el-select>
              <div id="newBookCount">

              </div>
            </el-col>
            <el-col :span="12">
              <div id="categoryBookshelfCount">

              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import PanelGroup from './PanelGroup'

export default {
  data() {
    return {
      categoryCountChart: '',
      categoryCounts: [], //
      bookCountChart: '',
      borrowCountChart: '',
      years: null, //所有年份
      year: '', //当前选择年份
      newBookCountChart: '',
      newBookCounts: [],
      categoryBookshelfCountChart: '',
      categoryBookshelfCounts: [],
    };
  },
  components: {
    PanelGroup
  },
  mounted(){
    this.initData();
  },
  methods: {
    initData(){
      this.categoryCountChart = echarts.init(document.getElementById('categoryCount'), 'light');
      this.bookCountChart = echarts.init(document.getElementById('bookCount'), 'light');
      this.borrowCountChart = echarts.init(document.getElementById('borrowCount'), 'light');
      this.newBookCountChart = echarts.init(document.getElementById('newBookCount'), 'light');
      this.categoryBookshelfCountChart = echarts.init(document.getElementById('categoryBookshelfCount'), 'light');
      const loadingOpt = {
        text: '正在统计...',
        color: '#409EFF',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.2)',
        zlevel: 0,
      }
      this.categoryCountChart.showLoading(loadingOpt);
      this.bookCountChart.showLoading(loadingOpt);
      this.borrowCountChart.showLoading(loadingOpt);
      this.newBookCountChart.showLoading(loadingOpt);
      this.categoryBookshelfCountChart.showLoading(loadingOpt);
      //获取数据
      this.getRequest("/book/catcount").then(resp =>{
        if (resp && resp.status == 200) {
          this.categoryCounts = resp.data;
        }
      }).then(() => {
          this.loadCategoryCount();
          //整理数据
          this.categoryCounts.bookSeriesData = [];
          this.categoryCounts.bookSelected = {};
          this.categoryCounts.borrowSeriesData = [];
          this.categoryCounts.borrowSelected = {};
          for(let i in this.categoryCounts){
            this.categoryCounts.bookSeriesData.push({
              name: this.categoryCounts[i].category,
              value: this.categoryCounts[i].count
            });
            this.categoryCounts.borrowSeriesData.push({
              name: this.categoryCounts[i].category,
              value: this.categoryCounts[i].borrowTimes
            });
            this.categoryCounts.bookSelected[this.categoryCounts[i].category] = true;
            this.categoryCounts.borrowSelected[this.categoryCounts[i].category] = true;
          };
          this.loadBookCount();
          this.loadBorrowCount();
      })
      this.getRequest("/bookshelf/count").then(resp =>{
        if (resp && resp.status == 200) {
          this.categoryBookshelfCounts = resp.data;
        }
      }).then(() => {
          this.categoryBookshelfCounts.seriesData = [];
          this.categoryBookshelfCounts.selected = {};
          for(let i in this.categoryBookshelfCounts){
            this.categoryBookshelfCounts.seriesData.push({
              name: this.categoryBookshelfCounts[i].category,
              value: this.categoryBookshelfCounts[i].count
            });
            this.categoryBookshelfCounts.selected[this.categoryBookshelfCounts[i].category] = true;
          };
          this.loadCategoryBookshelfCount();
      })
      this.getRequest("/book/years").then(resp =>{
        if (resp && resp.status == 200) {
          this.years = resp.data;
          this.year = this.years[0];
        }
      }).then(() => {
        this.reloadNewBook();
      })
    },
    yearChange(val){
      this.year = val;
      this.reloadNewBook();
    },
    reloadNewBook(){
      //获取对应年份数据
      this.getRequest("/book/newbook?year=" + this.year).then(resp =>{
        if (resp && resp.status == 200) {
          this.newBookCounts = resp.data;
        }
      }).then(() => {
        this.newBookCounts.seriesData = [];
        this.newBookCounts.selected = {};
        for(let i in this.newBookCounts){
          this.newBookCounts.seriesData.push({
            name: this.newBookCounts[i].category,
            value: this.newBookCounts[i].count
          });
          this.newBookCounts.selected[this.newBookCounts[i].category] = true;
        };
        this.loadNewBookCount();
      })
    },
    loadCategoryCount(){
      let option = {
        title: {
          text: '各类图书数量与借阅量统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
        },
        legend: {
          data: ['数量','借阅量']
        },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval:0,
            rotate:40
          },
          data: this.categoryCounts.map((item) => {
            return item.category;
          })
        },
        yAxis: {},
        series: [
          {
            name: '数量',
            type: 'bar',
            data: this.categoryCounts.map((item) => {
              return item.count
            })
          },
          {
            name: '借阅量',
            type: 'bar',
            data: this.categoryCounts.map((item) => {
              return item.borrowTimes
            })
          }
        ],

      }
      this.categoryCountChart.hideLoading(); //隐藏loading
      this.categoryCountChart.setOption(option)
    },
    loadBookCount(){
      let option = {
        title: {
            text: '各类图书数量统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 册 ({d}%)'
        },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: this.categoryCounts.map((item) => {
              return item.category;
            }),
            selected: this.categoryCounts.bookSelected
        },
        series: [
            {
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: this.categoryCounts.bookSeriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.bookCountChart.hideLoading();
      this.bookCountChart.setOption(option)
    },
    loadBorrowCount(){
      let option = {
        title: {
            text: '各类图书借阅量统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 次 ({d}%)'
        },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: this.categoryCounts.map((item) => {
              return item.category;
            }),
            selected: this.categoryCounts.borrowkSelected
        },
        series: [
            {
                name: '借阅量',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: this.categoryCounts.borrowSeriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.borrowCountChart.hideLoading();
      this.borrowCountChart.setOption(option)
    },
    loadNewBookCount(){
      let option = {
        title: {
            text: '各年新书量统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 册 ({d}%)'
        },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: this.newBookCounts.map((item) => {
              return item.category;
            }),
            selected: this.newBookCounts.selected
        },
        series: [
            {
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: this.newBookCounts.seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.newBookCountChart.hideLoading();
      this.newBookCountChart.setOption(option)
    },
    loadCategoryBookshelfCount(){
      let option = {
        title: {
            text: '各类图书架位占用统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} 格 ({d}%)'
        },
        toolbox: {
          feature: {
              saveAsImage: {}
          }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: this.categoryBookshelfCounts.map((item) => {
              return item.category;
            }),
            selected: this.categoryBookshelfCounts.selected
        },
        series: [
            {
                name: '数量',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: this.categoryBookshelfCounts.seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      };
      this.categoryBookshelfCountChart.hideLoading();
      this.categoryBookshelfCountChart.setOption(option)
    },
  }
}
</script>

<style>
  #categoryCount{
    width: 100%;
    height: 400px;
  }
  #bookCount{
    width: 100%;
    height: 400px;
  }
  #borrowCount{
    width: 100%;
    height: 400px;
  }
  #newBookCount{
    width: 100%;
    height: 400px;
  }
  #categoryBookshelfCount{
    width: 100%;
    height: 400px;
    margin-top: 28px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>

