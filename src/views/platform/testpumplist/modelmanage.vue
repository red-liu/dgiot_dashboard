<template>
  <el-container>
    <el-aside v-show="treeState" width="300px">
      <RoleTree ref="roleTreeRef" />
    </el-aside>
    <el-main>
      <div class="modelmanamge">
        <div class="mdoeltop">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                size="small"
              >
                <el-form-item label="质检项目">
                  <el-input
                    v-model="formInline.name"
                    placeholder="请输入项目名称"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">查询</el-button>
                  <el-button type="primary">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>

            <el-col :span="12">
              <div style="text-align: right">
                <el-button
                  plain
                  type="primary"
                  size="small"
                  @click="getIotHubProduct"
                >
                  查看台体
                </el-button>
              </div>
            </el-col>
          </el-row>

          <div class="adddevices">
            <el-button type="primary" size="small" @click="addStandard">
              新增质检项目
            </el-button>
          </div>
        </div>
        <!--表格-->
        <div class="tableblock">
          <el-table
            ref="multipleTable"
            :data="tableDataReport"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            />
            <el-table-column label="检验项目ID" align="center" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.objectId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="检验项目名称" align="center">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>

            <el-table-column label="产品分组类型" align="center">
              <template slot-scope="scope">{{ scope.row.devType }}</template>
            </el-table-column>

            <el-table-column
              label="适用产品"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.config && scope.row.config.client) || '无' }}
              </template>
            </el-table-column>
            <el-table-column label="检测标准管理" align="center" width="300">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="addReportChildren(scope.row)"
                >
                  新增模版
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteReport(scope.row.objectId)"
                >
                  删 除
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="detailReportChildren(scope.row)"
                >
                  模版管理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageblock">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pagesize"
            layout="sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <el-dialog
          :visible.sync="dialogVisible"
          title="检验质检项目"
          width="60%"
        >
          <div class="addContent">
            <el-form ref="reportFormRef" :model="reportForm">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="报告模版名称"
                  >
                    <el-input
                      v-model="reportForm.name"
                      autocomplete="off"
                      placeholder="报告模版名称"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- label="产品分组类型" -->
                  <el-form-item
                    :label-width="formLabelWidth"
                    label="报告模版类型"
                  >
                    <el-input
                      v-model="reportForm.devTypeText"
                      autocomplete="off"
                      placeholder="报告模版类型"
                    />

                    <!--   <el-select @change="devTypeSelectChange" v-model="reportForm.devType" placeholder="产品分组类型">
                  <el-option
                    v-for="(item) in productListForReport"
                    :label="item.devType"
                    :value="index"
                    :key="index"
                  ></el-option>
                    </el-select>-->
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item :label-width="formLabelWidth" label="适用产品">
                    <el-select
                      v-model="reportForm.client"
                      multiple
                      placeholder="选择适用产品"
                    >
                      <el-option
                        v-for="(item, index) in pumpmodel"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="2">
                  <span style="font-weight: bold">数据文件</span>
                </el-col>

                <el-col :span="4">
                  <p
                    v-if="selected_file && selected_file.src"
                    style="text-align: center; font-weight: bold"
                  >
                    {{ selected_file.name }}
                  </p>
                </el-col>

                <el-col :span="4">
                  <div>
                    <label for="inputId" class="img-uploader-label" />
                    <input
                      id="inputId"
                      ref="input"
                      style="display: none"
                      type="file"
                      accept="*.pdf, *.doc"
                      @change="file_selected($event)"
                    />
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="addReport">确 定</el-button> -->
            <el-button type="primary" @click="addReporttemp">确 定</el-button>
          </span>
        </el-dialog>
        <!--标准模版添加-->
        <el-dialog
          :visible.sync="dialogChildrenForm"
          title="新增标准模版"
          width="30%"
        >
          <el-form ref="childrenFormRef" :model="childrenform">
            <el-form-item :label-width="formLabelWidth" label="模版名称">
              <el-input v-model="childrenform.name" autocomplete="off" />
            </el-form-item>

            <el-form-item :label-width="formLabelWidth" label="模版模型">
              <img
                v-if="childrenform.imageSrc"
                :src="fileDomain + childrenform.imageSrc"
                class="avatar"
              />

              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <form
                ref="uploadform"
                method="POST"
                enctype="multipart/form-data"
                style="position: absolute"
              >
                <input
                  type="file"
                  style="
                    position: relative;
                    top: -100px;
                    opacity: 0;
                    z-index: 5;
                    height: 100px;
                    width: 100px;
                    cursor: pointer;
                  "
                  @change="upload($event)"
                />
              </form>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="排序">
              <el-input-number
                v-model="childrenform.index"
                :min="1"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChildrenForm = false">取 消</el-button>
            <el-button type="primary" @click="addStandardChildren">
              确 定
            </el-button>
          </div>
        </el-dialog>
        <!--模版管理-->
        <el-dialog :visible.sync="dialogTableVisible" title="模版" top="5vh">
          <el-table
            :data="producttable"
            style="width: 100%; text-align: center"
          >
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="100"
            />
            <el-table-column label="名称" align="center" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="内容" align="center">
              <template slot-scope="scope">
                <img
                  :src="fileDomain + scope.row.icon"
                  alt
                  class="el-upload-list__item-thumbnail"
                />
              </template>
            </el-table-column>
            <el-table-column label="模版管理" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="productView(scope.row.objectId)"
                >
                  绘图
                </el-button>
                <el-button
                  type="删除"
                  size="small"
                  @click="deleteProduct(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageblock">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              :page-size="productpagesize"
              :total="producttotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleProductSize"
              @current-change="handleProductChange"
            />
          </div>
        </el-dialog>

        <!--台体查看弹窗-->
        <el-dialog :visible.sync="iotHubDialogShow" title="台体列表" top="5vh">
          <el-table
            :data="iotHubProductList"
            stripe
            style="width: 100%; text-align: center"
          >
            <el-table-column label="序号" type="index" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="描述" prop="desc" />

            <el-table-column label="网络类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.netType == 'CELLULAR'">
                  蜂窝(2G/3G/4G)
                </span>
                <span v-else-if="scope.row.netType == 'WIFI'">WiFi</span>
                <span v-else-if="scope.row.netType == 'ETHERNET'">以太网</span>
                <span v-else-if="scope.row.netType == 'LORA'">LoRaWAN</span>
                <span v-else>{{ scope.row.netType }}</span>
              </template>
            </el-table-column>
          </el-table>
          <p><br /></p>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import RoleTree from '@/views/platform/testpumplist/pumplist/RoleTree'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ModelManamge',
    components: {
      RoleTree,
    },
    data() {
      return {
        action: 'http://file.iotn2n.com/shapes/upload',
        pumpmodel: [
          '离心泵',
          '潜水泵',
          '混流泵',
          '螺杆泵',
          '轴流泵',
          '旋涡泵',
          '电动泵',
          '蒸汽泵',
          '齿轮泵',
          '罗茨泵',
          '滑片泵',
          '喷射泵',
          '升液泵',
          '电磁泵',
        ],
        standard: [
          { label: '国际标准', value: 'ITBZ' },
          { label: '国家标准', value: 'GJBZ' },
          { label: '行业标准', value: 'HYBZ' },
          { label: '企业标准', value: 'QYBZ' },
          { label: '地方标准', value: 'DFBZ' },
          { label: '其他标准', value: 'OTHER' },
        ],
        ipaddr: '',
        formLabelWidth: '120px',
        dialogVisible: false,
        formInline: {
          name: '',
        },
        pagesize: 10,
        start: 0,
        total: 0,
        // 检验项目模板
        tableDataReport: [],
        reportForm: {
          name: '',
          product: '',
          model: '',
          nodeType: '',
          devTypeText: '',
          word: '',
          client: [],
        },
        childrenform: {
          name: '',
          imageSrc: '',
          index: 1,
        },
        dialogChildrenForm: false,
        // 模版管理
        dialogTableVisible: false,
        producttable: [],
        productpagesize: 10,
        producttotal: 0,
        productstart: 0,
        file: '',
        productListForReport: [],
        currentProduct: {},
        currentItemCount: 0,
        selected_file: {},
        iotHubProductList: [],
        iotHubDialogShow: false,
      }
    },
    computed: {
      fileDomain: function () {
        return this.$getUrlPrefix(this.$Cookies.get('fileserver'))
      },
      ...mapGetters(['treeState']),
    },
    mounted() {
      this.getReport()
    },
    methods: {
      getIotHubProduct() {
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.5)',
        })

        this.$axiosWen
          .get('/classes/Product', {
            params: {
              where: {
                category: 'IotHub',
              },
              order: '-updatedAt', // -updatedAt  updatedAt
            },
          })
          .then((response) => {
            loading.close()
            this.iotHubDialogShow = true
            if (response && response.results) {
              this.iotHubProductList = response.results
            } else {
              this.iotHubProductList = []
            }
          })
          .catch((err) => {
            loading.close()
          })
      },
      getReport() {
        this.$axiosWen
          .get('/classes/Product', {
            params: {
              where: {
                category: 'Evidence',
                nodeType: 1,
              },
              order: '-updatedAt', // -updatedAt  updatedAt
            },
          })
          .then((response) => {
            // this.productListForReport = response.results
            if (response && response.results) {
              this.tableDataReport = response.results
            } else {
              this.tableDataReport = []
            }
          })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.getReport()
      },
      handleCurrentChange(val) {
        this.start = (val - 1) * this.pagesize
        this.getReport()
      },
      handleProductSize(val) {
        this.productpagesize = val
        this.detailReportChildren(this.currentProduct)
      },
      handleProductChange(val) {
        this.start = (val - 1) * this.pagesize
        this.detailReportChildren(this.currentProduct)
      },
      file_selected(event) {
        var file = event.target.files[0]
        console.log(file)
        // 判断是否上传的是word文件
        const regx = /.*(.doc|.docx)$/ // 判断返回的文件是否为word文件
        console.log(regx.test(file.name))
        if (regx.test(file.name)) {
          this.fileRead(file)
          this.uploadDocx(file)
        } else {
          this.$message({
            type: 'error',
            message: '只允许上传后缀为doc,docx的文件',
          })
        }
      },
      uploadDocx(file) {
        var formdata = new FormData()
        formdata.append('file', file)
        formdata.append('output', 'json')
        formdata.append('path', this.$Cookies.get('appids'))
        formdata.append('scene', this.$Cookies.get('appids'))
        formdata.append('auth_token', this.$Cookies.get('access_token_pump')) // 下面是要传递的参数
        this.$http
          .post(this.$Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              console.log(res.body.src)
              this.reportForm.word = res.body.src
            }
          })
      },
      fileRead(file) {
        const reader = new FileReader()
        var vm = this
        reader.vue = this
        reader.readAsDataURL(file)
        reader.onload = function () {
          // 放到上个函数里,vue不会及时刷新视图
          vm.selected_file = file

          vm.selected_file.src = this.result
        }
      },
      // 增加设备弹窗
      addStandard() {
        this.dialogVisible = true
      },
      // 添加报告模板
      addReporttemp() {
        const exportData = {
          config: JSON.stringify({
            identifier: 'inspectionReportTemp',
            client: this.reportForm.client,
          }),
          name: this.reportForm.name,
          type: this.reportForm.devTypeText,
          word: this.reportForm.word,
        }
        console.log(exportData, 'exportData')
        this.$axiosWen
          .post('/python_pump_reporttemp', exportData)
          .then((response) => {
            this.$message({ type: 'success', message: '报告创建成功!' })
            console.log(response, 'success')
            this.$refs['reportFormRef'].resetFields()
            this.dialogVisible = false
            this.getReport()
          })
          .catch((e) => {
            this.$message({ type: 'error', message: `报告创建失败${e.error}` })
            console.log(e.error)
          })
      },
      addReport(nodeTypeText) {
        // 添加质检项目

        var postData = {}
        // 如果用户上传了文件,就调用 post
        if (this.selected_file && this.selected_file.size) {
          /*         postData = {
          devType: this.reportForm.devTypeText,
          name: this.reportForm.name,
          config: {
            identifier: "inspectionReportTemp",
            client: this.reportForm.client
          },
          file: this.selected_file
        }; */

          const formData = new FormData()

          const configTemp = {
            identifier: 'inspectionReportTemp',
            client: this.reportForm.client,
          }

          formData.append('devType', this.reportForm.devTypeText)
          formData.append('name', this.reportForm.name)
          formData.append('config', JSON.stringify(configTemp))

          formData.append('file', this.selected_file)

          this.postReportTemp(formData)
        } else {
          postData = {
            config: {
              identifier: 'inspectionReportTemp',
              name: '组态',
              client: this.reportForm.client, // 适用产品
            },
            desc: String(0), // 页码,默认0
            devType: this.reportForm.devTypeText, // 产品分组类型 -> 质检项目模版名称  2020 08-10 hughwang
            name: this.reportForm.name, // 报告模版名称
            nodeType: 1, // 设备0 or 网关1
            category: 'Evidence',
          }

          this.putReportTemp('gatewayFlag', postData)
        }
      },
      postReportTemp(formData) {
        console.log(formData, 'formData')
        return false
        const loading = this.$loading({
          background: 'rgba(0, 0, 0, 0.6)',
        })
        this.$axiosWen
          .post('/reportTemp', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            loading.close()
            if (response) {
              this.$message({ type: 'success', message: `创建成功` })
              this.$refs['reportFormRef'].resetFields()
              this.dialogVisible = false
              this.getReport()
            } else {
              this.$message({ type: 'error', message: `创建失败}` })
            }
          })
          .catch((err) => {
            loading.close()
            this.$message({ type: 'error', message: `接口错误${e.error}` })
          })
      },
      putReportTemp(nodeTypeText, postData) {
        // 通过节点类型判断
        this.$axiosWen.put('/reportTemp', postData).then((response) => {
          if (response) {
            if (nodeTypeText == 'deviceFlag') {
              this.$message({ type: 'success', message: `新增成功` })
              this.$refs['childrenFormRef'].resetFields()
              this.dialogChildrenForm = false
            } else {
              this.$message({ type: 'success', message: `创建成功` })
              this.$refs['reportFormRef'].resetFields()
              this.dialogVisible = false
            }
            this.getReport()
          }
        })
      },
      addReportChildren(row) {
        // 获取当前项目的子项数量
        this.currentDevType = row.devType
        this.currentNodeType = row.nodeType

        //  const loading = this.$loading({text: 'Loading',spinner: 'el-icon-loading'})
        this.$axiosWen
          .get('/classes/Product', {
            params: {
              keys: 'count(*)',
              where: {
                devType: this.currentDevType,
                nodeType: 0, // 去掉nodeType.不然有时候会报错
              },
              order: 'basedata.index',
            },
          })
          .then((response) => {
            // loading.close()
            this.currentItemCount = response.count
            this.dialogChildrenForm = true
          })
          .catch((res) => {
            this.currentItemCount = res.count
            this.dialogChildrenForm = true
          })
      },
      // 增加子模版
      addStandardChildren() {
        if (this.childrenform.imageSrc == '') {
          this.$message('请上传模版图片')
          return
        }
        // 添加子项
        var topoData = {
          config: {
            name: '组态',
            client: this.reportForm.client,
            layer: {
              width: 600,
              height: 850,
              backColor: '#eee',
              backgroundImage: this.childrenform.imageSrc,
              widthHeightRatio: '',
            },
            deviceid: '',
            components: [],
            index: this.childrenform.index,
          },
          icon: this.childrenform.imageSrc,
          nodeType: 0, // 设备
          desc: String(this.currentItemCount + 1), // 页码,默认0
          devType: this.currentDevType, // 产品分组类型
          name: this.childrenform.name,
          category: 'Evidence',
        }

        this.putReportTemp('deviceFlag', topoData)
      },
      detailReportChildren(row) {
        // const loading = this.$loading({text: 'Loading',spinner: 'el-icon-loading'})
        this.currentProduct = row
        var where = {
          // devType: { $in: row.product }
          devType: this.currentProduct.devType,
          nodeType: 0,
        }

        this.$axiosWen
          .get('/classes/Product', {
            params: {
              limit: this.productpagesize,
              skip: this.productstart,
              keys: 'count(*)',
              where: JSON.stringify(where),
              order: 'createdAt', // -updatedAt  updatedAt
            },
          })
          .then((response) => {
            // loading.close()
            this.dialogTableVisible = true
            this.producttable = response.results
            this.producttotal = response.count
          })
          .catch((error) => {
            // loading.close()
            console.log(error)

            this.$message({
              type: 'error',
              massage: error.msg,
            })
          })
      },
      deleteReport(id) {
        this.$confirm('此操作将永久删除该质检项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$axiosWen.delete('/classes/Product/' + id).then((res) => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getReport()
            }
          })
        })
      },
      deleteImgsrc() {
        event.stopPropagation()
        this.childrenform.imageSrc = ''
      },
      productView(id) {
        // #topoUrl
        if (this.$globalConfig.serverURL.substr(0, 1) == '/') {
          var topoUrl = window.location.origin + '/spa'
        } else {
          var topoUrl = this.$globalConfig.localTopoUrl
        }
        // 绘制

        var url = `${topoUrl}/#/?drawProudctid=${id}`
        window.open(url, '__blank')
      },
      // 删除产品
      deleteProduct(row) {
        // this.$log(row)
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axiosWen
            .delete('/classes/Product/' + row.objectId)
            .then((res) => {
              if (res) {
                this.$message({ type: 'success', message: `删除成功` })
                this.detailReportChildren(this.currentProduct)
              }
            })
        })
      },
      // 图片上传
      upload(event, type) {
        if (event) {
          var file = event.target.files[0]
          var name = file.name
          var filetype = event.target.files[0].type
          this.imgtype = type
          this.uploadFile(file, name) // 执行上传接口
        }
      },
      // 上传doc文件
      submitUpload(v) {
        console.log(v)
        console.log(this.$refs.input)
        const input = this.$refs.input
        console.log(input.target)
      },
      uploadFile(file, name) {
        var formdata = new FormData()
        formdata.append('file', file)
        formdata.append('output', 'json')
        formdata.append('path', this.$Cookies.get('appids'))
        formdata.append('scene', this.$Cookies.get('appids'))
        formdata.append('auth_token', this.$Cookies.get('access_token_pump')) // 下面是要传递的参数
        // 此处必须设置为  multipart/form-data
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data', // 之前说的以表单传数据的格式来传递fromdata
          },
        }
        this.$http
          .post(this.$Cookies.get('fileserver'), formdata)
          .then((res) => {
            if (res) {
              this.childrenform.imageSrc = res.body.src
            }
          })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .modelmanamge {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #ffffff;
    ::v-deep .el-select {
      width: 100%;
    }
    ::v-deep .el-date-editor {
      width: 100%;
    }
    ::v-deep .el-input-number {
      width: 100%;
    }
    .tableblock {
      margin-top: 20px;
    }
    .pageblock {
      margin-top: 20px;
    }

    .img-uploader-label {
      display: inline-block;
      width: 76px;
      height: 76px;
      color: #ccc;
      border: 2px dashed;
      position: relative;
      overflow: hidden;
      transition: all 0.25s;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
      }
      &::before {
        width: 20px;
        border-top: 4px solid;
        margin: -2px 0 0 -10px;
      }
      &::after {
        height: 20px;
        border-left: 4px solid;
        margin: -10px 0 0 -2px;
      }
      &:hover {
        color: skyblue;
      }
    }
  }
</style>
<style>
  .avatar-uploader {
    display: inline-block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border: 1px dashed #cccccc;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
  .el-upload-list__item-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    margin-left: -80px;
    background-color: #fff;
  }
  /* @media screen and (max-width: 1350px) {
  .modelmanamge .el-col {
    width: 100%;
  }
} */
</style>
