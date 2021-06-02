<!--
 * @Author: h7ml
 * @Date: 2021-02-02 17:52:06
 * @LastEditTime: 2021-03-15 12:42:33
 * @LastEditors: h7ml
 * @Description: In User Settings Edit
 * @FilePath: \dgiot_dashboard\src\views\equipment_management\platform_overview.vue
-->
<template>
  <div class="platform">
    <el-row :row="24">
      <el-col :span="18" :xs="24">
        <el-tabs v-model="activeName">
          <el-row v-show="false">
            <el-col
              v-for="item in projectList"
              :key="item.id"
              :xs="24"
              :sm="24"
              :md="8"
              :lg="{ span: '4-8' }"
            >
              <el-card class="box-card" shadow="always">
                <div slot="header" class="clearfix">
                  <span>
                    {{ item.name }}
                  </span>
                </div>
                <div v-if="item.userUnit" class="text item">
                  <span>{{ $translateTitle('home.unit') }}</span>
                  <span>{{ item.userUnit }}</span>
                </div>
                <div v-if="item.scale" class="text item">
                  <span>{{ $translateTitle('home.scale') }}：</span>
                  <span>{{ item.scale }}</span>
                </div>
                <div class="text item">
                  <span>{{ $translateTitle('home.category') }}：</span>
                  <span>{{ getCategory(item.category) }}</span>
                </div>
                <div class="text item">
                  <span>{{ $translateTitle('home.updatedAt') }}：</span>
                  <span>
                    {{
                      new Date(item.updatedAt).toLocaleDateString() +
                      ' ' +
                      new Date(item.updatedAt).toLocaleTimeString()
                    }}
                  </span>
                </div>
                <div class="text item" style="text-align: center">
                  <el-button-group>
                    <el-button
                      style="margin-right: 3px"
                      size="mini"
                      type="success"
                      @click="Gotoproduct(item.name)"
                    >
                      {{ $translateTitle('home.preview') }}
                    </el-button>
                    <el-button
                      v-if="NODE_ENV == 'development'"
                      size="mini"
                      type="primary"
                      target="_blank"
                      @click="handleClickVisit(item)"
                    >
                      {{ $translateTitle('home.konva') }}
                    </el-button>
                  </el-button-group>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row :span="24">
            <div class="chart_map">
              <baidu-map
                :scroll-wheel-zoom="true"
                class="map"
                :center="{ lng: 116.404, lat: 39.915 }"
                style="height: 78vh"
                :zoom="sizeZoom"
              >
                <bm-control>
                  <el-button size="mini" @click="sizeZoom = 19">
                    {{ $translateTitle('home.max') }}
                  </el-button>
                  <el-button size="mini" @click="sizeZoom = 10">
                    {{ $translateTitle('home.restore') }}
                  </el-button>
                  <el-button size="mini" @click="sizeZoom = 3">
                    {{ $translateTitle('home.min') }}
                  </el-button>
                  <bm-panorama
                    anchor="BMAP_ANCHOR_TOP_LEFT"
                    :offset="{ width: 460, height: 0 }"
                  />
                  <bm-overview-map :is-open="true" />
                  <bm-scale :offset="{ width: 200, height: 0 }" />
                  <bm-city-list :offset="{ width: 280, height: 0 }" />
                  <bm-map-type
                    anchor="BMAP_ANCHOR_TOP_LEFT"
                    :map-types="['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP']"
                    :offset="{ width: 360, height: 0 }"
                  />
                </bm-control>
                <bm-marker
                  v-for="(item, index) in tableData"
                  :key="item.objectId"
                  :content="item.name"
                  :position="{
                    lng: item.location.longitude,
                    lat: item.location.latitude,
                  }"
                  :dragging="true"
                  animation="BMAP_ANIMATION_BOUNCE"
                >
                  <bm-label
                    :content="item.name"
                    :label-style="{ color: 'red', fontSize: '12px' }"
                    :offset="{
                      width: -35 * index,
                      height: 30 * index,
                    }"
                    @click="deviceToDetail(item)"
                  />
                </bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
                <bm-geolocation
                  :show-address-bar="true"
                  :auto-location="true"
                  anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                />
              </baidu-map>
            </div>
          </el-row>
          <!-- <el-tab-pane label="统计总览" name="devchart">

      </el-tab-pane> -->
        </el-tabs>
      </el-col>
      <el-col :xs="24" :span="6">
        <div class="home_card">
          <div class="box-card">
            <el-card>
              <div slot="header" class="clearfix">
                <span>{{ $translateTitle('home.info') }}</span>
              </div>
              <div>
                <el-row>
                  <el-col :span="18">
                    <ve-histogram
                      height="250px"
                      :data="chartData"
                      use-data-converter
                    />
                  </el-col>
                  <el-col :span="6">
                    <div style="margin-left: 20px">
                      <p>
                        {{
                          $translateTitle('home.app_count') +
                          ':' +
                          project_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.pro_count') +
                          ':' +
                          product_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.cla_count') + ':' + app_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.dev_count') + ':' + dev_count
                        }}
                      </p>
                      <p>
                        {{
                          $translateTitle('home.dev_online') +
                          ':' +
                          dev_online_count
                        }}
                      </p>
                      <p>
                        {{ $translateTitle('home.dev_unline') + ':' }}
                        {{ dev_count - dev_online_count }}
                      </p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
          <div class="box-card">
            <el-card>
              <div slot="header" class="clearfix">
                <span>未确认报警展示</span>
                <el-button style="float: right; padding: 3px 0" type="text">
                  操作按钮
                </el-button>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{ '设备 ' + o }}
              </div>
            </el-card>
          </div>
          <div class="box-card">
            <el-card>
              <div slot="header" class="clearfix">
                <span>设备在线率</span>
                <el-button style="float: right; padding: 3px 0" type="text">
                  操作按钮
                </el-button>
              </div>
              <ve-ring
                height="250px"
                width="350px"
                :data="chartData"
                :extend="chartExtend"
                :settings="chartSettings"
              />
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { batch } from '@/api/Batch/index'
  import { queryDevice } from '@/api/Device'
  import Category from '@/api/Mock/Category'
  import {
    BmNavigation,
    BaiduMap,
    BmGeolocation,
    BmCityList,
    BmMarker,
    BmLabel,
    BmControl,
    BmPanorama,
    BmOverviewMap,
    BmMapType,
    BmScale,
  } from 'vue-baidu-map'
  export default {
    name: 'Index',
    components: {
      BmScale,
      BmMapType,
      BmOverviewMap,
      BmPanorama,
      BmControl,
      BmLabel,
      BaiduMap,
      BmNavigation,
      BmGeolocation,
      BmCityList,
      BmMarker,
    },
    data() {
      this.chartExtend = {
        legend: { show: false }, //隐藏legend
        series: {
          center: ['50%', '50%'],
        },
      }
      return {
        chartData: {
          columns: [],
          rows: [],
        },
        sizeZoom: 10,
        tableData: [],
        chartSettings: {
          radius: ['60px', '80px'],
          label: {
            formatter: (params) => {
              if (params.dataIndex === 0) {
                return `{a| 通过率${params.percent}%}`
              } else {
                return `{b| 未过率${params.percent}%}`
              }
            },
            rich: {
              a: {
                color: '#438de7',
              },
              b: {
                color: '#7b7d86',
              },
            },
          },
          itemStyle: {
            color: (seriesIndex) => {
              if (seriesIndex.dataIndex === 0) {
                return {
                  type: 'linear',
                  x: 0,
                  y: 1,
                  x2: 0,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#4a8eea', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#75b9f9', // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#77c5f7', // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#78d0f5', // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                }
              } else {
                return '#dbdbe3'
              }
            },
          },
        },
        NODE_ENV: process.env.NODE_ENV,
        category: Category,
        activeName: 'devchart',
        filterBox: 'filterBox-first',
        project_count: '-',
        app_count: '-',
        product_count: '-',
        dev_count: '-',
        dev_active_count: '-',
        dev_online_count: '-',
        projectList: [],
        formInline: {
          starttime: '',
          project: '',
        },
      }
    },
    mounted() {
      this.getAllAxios()
      console.log(this.category)
      this.getDevices()
    },
    activated() {
      console.log('keep-alive生效')
    }, //如果页面有keep-alive缓存功能，这个函数会触发
    methods: {
      async getDevices() {
        const { results } = await queryDevice({})
        results.forEach((i) => {
          if (!i.location) {
            // location 容错处理
            i.location = { longitude: 0, latitude: 0 }
          }
        })
        this.tableData = results
      },
      getCategory(key) {
        console.log(key)
        let name = ''
        this.category.filter((item) => {
          if (item.type == key) {
            name = item.data.CategoryName
          }
        })
        return name
      },
      // async getAllAxios() {
      //   console.log(process.env)
      //   this.$baseColorfullLoading(
      //     1,
      //     this.$translateTitle('home.messag_loding')
      //   )
      //   // （1）如果列为主键，count(列名)效率优于count(1)
      //   // （2）如果列不为主键，count(1)效率优于count(列名)
      //   // （3）如果表中存在主键，count(主键列名)效率最优
      //   // （4）如果表中只有一列，则count(*)效率最优
      //   // （5）如果表有多列，且不存在主键，则count(1)效率优于count(*)
      //   let params = {
      //     // count: 'objectId',
      //     count: 'objectId',
      //     limit: 1,
      //     skip: 0,
      //     where: {},
      //   }
      //   const res = await this.$moreHttp({
      //     dev_num: await dev_count(params),
      //     app_num: await app_count(params),
      //     projectList: await app_count({
      //       limit: 30,
      //     }),
      //     Product_num: await product_count(params),
      //     Project_num: await Project_count(params),
      //     dev_active_num: await dev_active_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ACTIVE',
      //         },
      //       })
      //     ),
      //     dev_online_num: await dev_online_count(
      //       Object.assign(params, {
      //         where: {
      //           status: 'ONLINE',
      //         },
      //       })
      //     ),
      //   })
      //   const {
      //     dev_num = { count: 0 },
      //     Product_num = { count: 0 },
      //     Project_num = { count: 0 },
      //     app_num = { count: 0 },
      //     dev_active_num = { count: 0 },
      //     dev_online_num = { count: 0 },
      //     projectList = { results: {} },
      //   } = res
      //   this.$baseColorfullLoading().close()
      //   console.log(res)
      //   console.log(dev_online_num)
      //   this.dev_count = dev_num.count || 0
      //   this.product_count = Product_num.count
      //   this.project_count = Project_num.count
      //   this.app_count = app_num.count
      //   this.projectList = projectList.results
      //   this.dev_active_count = dev_active_num.count
      //   this.dev_online_count = dev_online_num.count
      // },
      async getAllAxios() {
        var rows = {}
        this.chartData.columns.push(
          '日期',
          this.$translateTitle('home.app_count'),
          this.$translateTitle('home.pro_count'),
          this.$translateTitle('home.cla_count'),
          this.$translateTitle('home.dev_count'),
          this.$translateTitle('home.dev_online'),
          this.$translateTitle('home.dev_unline')
        )
        this.chartData.columns.forEach((i) => {
          rows[i] = 0
          rows['日期'] = moment().format('YYYY-MM-DD HH:mm:ss')
        })
        this.chartData.rows[0] = rows
        this.$baseColorfullLoading(
          1,
          this.$translateTitle('home.messag_loding')
        )
        let _queryParams = {
          count: 'objectId',
          limit: 1,
          skip: 0,
          where: {},
        }
        const params = [
          {
            method: 'GET',
            path: '/classes/Project',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Product',
            body: {
              // 这里查product 是导致整个查询变慢的主要原因
              count: 'objectId',
              skip: 0,
              keys: 'updatedAt,category,desc',
              where: {
                category: 'IotHub',
                // category: 'Evidence',
                // nodeType: 1,
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/App',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: _queryParams,
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ACTIVE',
              },
            },
          },
          {
            method: 'GET',
            path: '/classes/Device',
            body: {
              count: 'objectId',
              limit: 1,
              skip: 0,
              where: {
                status: 'ONLINE',
              },
            },
          },
        ]
        await batch(params)
          .then((res) => {
            let columnsdata = []
            this.$baseColorfullLoading().close()
            this.dev_count = res[0].success.count
            this.projectList = res[1].success.results
            this.product_count = res[1].success.count
            this.project_count = res[2].success.count
            this.dev_count = res[3].success.count
            this.app_count = res[4].success.count
            this.dev_online_count = res[5].success.count
            columnsdata.push(
              this.project_count,
              this.product_count,
              this.app_count,
              this.dev_count,
              this.dev_online_count,
              this.dev_count - this.dev_online_count
            )
            console.log(rows)
            this.chartData.columns.forEach((i, index) => {
              console.log(i, index)
              // rows[`${this.chartData.columns}`] = index
              for (var key in rows) {
                // rows['类别'] = this.chartData.columns
                if (key == i) {
                  console.log('index', rows[key])
                  rows[`${key}`] = columnsdata[index]
                }
                rows['日期'] = moment().format('YYYY-MM-DD HH:mm:ss')
                // console.log(key, rows[`${key}`])
              }
            })
            this.chartData.rows[0] = rows
          })
          .catch((error) => {
            this.$baseColorfullLoading().close()
            console.log(error)
            this.chartData.rows[0] = rows
          })
        this.$set(this.chartData, 'rows', [rows])
        console.log(this.chartData)
      },
      handleChange() {},
      handleClickVisit(project) {
        this.$router.push({
          path: '/Topo/VueKonva',
          query: {
            productid: project.objectId,
          },
        })
      },
      Gotoproduct(name) {
        this.$router.push({
          path: '/dashboard/productlist',
          query: {
            project: name,
          },
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  //@media only screen and (min-width: 768px) {
  //  .el-col-sm-4-8 {
  //    width: 20%;
  //  }
  //
  //  .el-col-sm-offset-4-8 {
  //    margin-left: 20%;
  //  }
  //
  //  .el-col-sm-pull-4-8 {
  //    position: relative;
  //
  //    right: 20%;
  //  }
  //
  //  .el-col-sm-push-4-8 {
  //    position: relative;
  //
  //    left: 20%;
  //  }
  //}
  //
  //@media only screen and (min-width: 992px) {
  //  .el-col-md-4-8 {
  //    width: 20%;
  //  }
  //
  //  .el-col-md-offset-4-8 {
  //    margin-left: 20%;
  //  }
  //
  //  .el-col-md-pull-4-8 {
  //    position: relative;
  //
  //    right: 20%;
  //  }
  //
  //  .el-col-md-push-4-8 {
  //    position: relative;
  //
  //    left: 20%;
  //  }
  //}
  //
  //@media only screen and (min-width: 1200px) {
  //  .el-col-lg-4-8 {
  //    width: 20%;
  //  }
  //
  //  .el-col-lg-offset-4-8 {
  //    margin-left: 20%;
  //  }
  //
  //  .el-col-lg-pull-4-8 {
  //    position: relative;
  //
  //    right: 20%;
  //  }
  //
  //  .el-col-lg-push-4-8 {
  //    position: relative;
  //
  //    left: 20%;
  //  }
  //}
  //
  //@media only screen and (min-width: 1920px) {
  //  .el-col-xl-4-8 {
  //    width: 20%;
  //  }
  //
  //  .el-col-xl-offset-4-8 {
  //    margin-left: 20%;
  //  }
  //
  //  .el-col-xl-pull-4-8 {
  //    position: relative;
  //
  //    right: 20%;
  //  }
  //
  //  .el-col-xl-push-4-8 {
  //    position: relative;
  //
  //    left: 20%;
  //  }
  //}
  .platform {
    box-sizing: border-box;
    width: 100%;
    //height: calc(100vh - #{$base-top-bar-height}* 3 - 25px);
    padding: 10px;
    background-size: 100%;
    .chart_map {
      margin: 8px;
    }
    //.home_card {
    //  margin: 20px;
    //  .box-card {
    //    height: 50%;
    //  }
    //}
    .box-card {
      padding: 5px;
      margin: 5px;
    }
    .clearfix {
      ont-weight: bolder;
      text-align: center;
    }
    .card-left {
      font-size: 80px;
      color: white;
    }
    .card-right p:first-child {
      padding: 5px;
      margin: 0px;
      font-size: 14px;
      font-weight: bolder;
    }
    //.card-right p:last-child {
    //  padding: 5px;
    //  margin: 0px;
    //  font-size: 40px;
    //  font-weight: bolder;
    //  color: #8b1515;
    //}
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  i {
    display: block !important;
    width: 50px;
    height: 50px;
    margin: auto;
    margin-top: -10px;
    font-size: 50px !important;
    font-size: 40px;
    color: black;
    transition: all ease-in-out 0.3s;
  }
</style>
