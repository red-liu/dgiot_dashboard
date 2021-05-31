<!-- 组件说明 -->
<template>
  <div class="operation">
    <el-tabs v-model="activeName">
      <div class="unvisible">
        <el-upload
          ref="upload"
          class="upload-demo"
          style="display: none"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <el-tab-pane label="配置" name="setting">
        <el-form v-if="Shapeconfig.className">
          <el-form-item>
            <vue-json-editor
              v-if="showJson"
              v-model="Shapeconfig"
              :mode="'code'"
              lang="zh"
            />
            <el-button type="primary" @click="saveKonvaitem(Shapeconfig)">
              {{ $translateTitle('developer.determine') }}
            </el-button>
            <el-button type="primary" @click="showJson = !showJson">
              {{ $translateTitle('developer.json') }}
            </el-button>
            <el-button
              type="primary"
              :disabled="disabledModule"
              @click="handleModule(wmxdialogVisible)"
            >
              <!-- {{ $translateTitle('developer.json') }}  -->
              物模型
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式" name="styles">样式</el-tab-pane>
      <el-tab-pane label="行为" name="function">行为</el-tab-pane>
      <div class="TopoArom">
        <el-dialog
          :title="wmxSituation + '自定义属性'"
          :visible.sync="wmxdialogVisible"
          :before-close="wmxhandleClose"
          :close-on-click-modal="false"
          width="60%"
          top="5vh"
        >
          <wmxdetail
            ref="sizeForm"
            :size-form1="sizeForm"
            @addDomain="addDomain"
            @removeDomain="removeDomain"
            @wmxhandleClose="wmxhandleClose"
            @submitForm="submitForm"
          />
        </el-dialog>
      </div>
    </el-tabs>
  </div>
</template>

<script>
  import wmxdetail from '@/views/equipment_management/component/wmxdetail'
  import { get_wmxdetail } from '@/api/Topo'

  import vueJsonEditor from 'vue-json-editor'

  export default {
    name: 'Operation',
    components: { vueJsonEditor, wmxdetail },
    props: {
      stopMqtt: {
        type: Boolean,
        default: false,
      },
      drawerflag: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        properties: [],
        wmxSituation: '',
        wmxdialogVisible: false,
        sizeForm: {},
        disableLable: ['id'],
        hideLable: ['draggable'],
        ShowItem: ['container'],
        collapseName: ['1'],
        allunit: {},
        wmxData: [],
        showNewItem: true,
        disabledModule: false,
        options: [],
        sizeOption: [],
        wmxstart: 1,
        wmxPageSize: 2,
        isVisible: true,
        showJson: true,
        sizerule: {
          type: 'int',
        },
        fileList: [
          {
            name: 'food.jpeg',
            url:
              'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
          {
            name: 'food2.jpeg',
            url:
              'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          },
        ],
        Shapeconfig: {},
        productconfig: {},
        bachgroundurl: '',
        activeName: 'setting',
      }
    },
    computed: {}, //生命周期 - 销毁完成
    watch: {
      Shapeconfig: {
        deep: true,
        handler(val) {
          this.disabledModule = val.className == 'Stage' ? true : false
        },
      },
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {},
    activated() {},
    methods: {
      // 删除枚举型
      removeDomain(item) {
        var index = this.sizeForm.struct.indexOf(item)
        if (index !== -1) {
          this.sizeForm.struct.splice(index, 1)
        }
      },
      addDomain() {
        this.sizeForm.struct.push({
          attribute: '',
          attributevalue: '',
        })
      },
      // 重置
      reset() {
        this.sizeForm = {
          name: '',
          identifier: '',
          strategy: '20',
          resource: 1,
          dis: '',
          dinumber: '528590',
          type: 'int',
          startnumber: '',
          endnumber: '',
          step: '',
          true: '',
          truevalue: 1,
          false: '',
          falsevalue: 0,
          isread: 'r',
          unit: '',
          string: '',
          date: 'String类型的UTC时间戳 (毫秒)',
          specs: {},
          round: 'all',
          struct: [
            {
              attribute: '',
              attributevalue: '',
            },
          ],
          rate: 1,
          offset: 0,
          byteorder: 'big',
          protocol: 'normal',
          operatetype: 'holdingRegister',
          originaltype: 'int16',
          slaveid: 256,
          collection: '%s',
          control: '%q',
          nobound: [],
        }
      },
      handleModule(e) {
        this.wmxdialogVisible = !e
        const { thing = { properties: [] } } = this.productconfig
        let properties = thing.properties
        this.properties = properties
        console.log(properties)
        console.log(this.Shapeconfig)
        if (properties.length) {
          let _fortype = properties.some((e) => {
            return e.dataForm.address === this.Shapeconfig.attrs.id
          })
          if (_fortype) {
            properties.forEach((rowData) => {
              this.wmxSituation == '修改'
              if (rowData.identifier === this.Shapeconfig.attrs.id) {
                console.log(`物模型存在这个属性`, rowData)
                this.reset()
                // this.wmxData = item
                var obj = {}
                // 提交之前需要先判断类型
                if (
                  ['float', 'double', 'int'].indexOf(rowData.dataType.type) !=
                  -1
                ) {
                  obj = {
                    name: rowData.name,
                    // rowData.dataType
                    type: rowData.dataType.type,
                    endnumber: this.$objGet(rowData, 'dataType.specs.max'),
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    // : rowData.dataForm.
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    collection: '',
                    control: '',
                    strategy: '',
                    required: true,
                    isread: rowData.accessMode,
                    identifier: rowData.identifier,
                  }
                  if (rowData.dataForm) {
                    obj.collection = rowData.dataForm.collection
                    obj.control = rowData.dataForm.control
                    obj.strategy = rowData.dataForm.strategy
                  }
                } else if (rowData.dataType.type == 'bool') {
                  obj = {
                    name: rowData.name,
                    type: rowData.dataType.type,
                    true: rowData.dataType.specs[1],
                    false: rowData.dataType.specs[0],
                    // rowData.dataForm.
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    required: false,
                    isread: rowData.accessMode,
                    identifier: rowData.identifier,
                    collection:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.collection,
                    control:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.control,
                    strategy:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.strategy,
                  }
                } else if (rowData.dataType.type == 'enum') {
                  var structArray = []
                  for (const key in rowData.dataType.specs) {
                    structArray.push({
                      attribute: key,
                      attributevalue: rowData.dataType.specs[key],
                    })
                  }
                  obj = {
                    name: rowData.name,
                    type: rowData.dataType.type,
                    specs: rowData.dataType.specs,
                    struct: structArray,
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    required: true,
                    isread: rowData.accessMode,
                    identifier: rowData.identifier,
                    collection:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.collection,
                    control:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.control,
                    strategy:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.strategy,
                  }
                } else if (rowData.dataType.type == 'struct') {
                  obj = {
                    name: rowData.name,
                    type: rowData.dataType.type,
                    struct: rowData.dataType.specs,
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    required: true,
                    isread: rowData.accessMode,
                    collection:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.collection,
                    control:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.control,
                    identifier:
                      rowData.dataForm == undefined ? '' : rowData.identifier,
                    strategy:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.strategy,
                  }
                } else if (rowData.dataType.type == 'string') {
                  obj = {
                    name: rowData.name,
                    type: rowData.dataType.type,
                    collection:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.collection,
                    control:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.control,
                    string: rowData.dataType.size,
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    required: true,
                    isread: rowData.accessMode,
                    identifier: rowData.identifier,
                    strategy:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.strategy,
                  }
                } else if (rowData.dataType.type == 'date') {
                  obj = {
                    name: rowData.name,
                    type: rowData.dataType.type,
                    collection:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.collection,
                    control:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.control,
                    strategy:
                      rowData.dataForm == undefined
                        ? ''
                        : rowData.dataForm.strategy,
                    startnumber: this.$objGet(rowData, 'dataType.specs.min'),
                    step: this.$objGet(rowData, 'dataType.specs.step'),
                    unit: this.$objGet(rowData, 'dataType.specs.unit'),
                    round: this.$objGet(rowData, 'dataForm.round'),
                    dis: this.$objGet(rowData, 'dataForm.address'),
                    dinumber: this.$objGet(rowData, 'dataForm.quantity'),
                    rate: this.$objGet(rowData, 'dataForm.rate'),
                    offset: this.$objGet(rowData, 'dataForm.offset'),
                    byteorder: this.$objGet(rowData, 'dataForm.byteorder'),
                    protocol: this.$objGet(rowData, 'dataForm.protocol'),
                    operatetype: this.$objGet(rowData, 'dataForm.operatetype'),
                    originaltype: this.$objGet(
                      rowData,
                      'dataForm.originaltype'
                    ),
                    slaveid: this.$objGet(rowData, 'dataForm.slaveid'),
                    required: true,
                    isread: rowData.accessMode,
                    identifier: rowData.identifier,
                  }
                }
                this.sizeForm = obj
              }
            })
          } else {
            this.wmxSituation == '新增'
            console.log('物模型不为空，但不存在这个属性', this.Shapeconfig)
            this.reset()
            this.wmxData = []
            this.sizeForm.name = this.Shapeconfig.attrs.text
            this.sizeForm.dis = this.Shapeconfig.attrs.id
            this.sizeForm.isdis = true
          }
        } else {
          console.log(`物模型为空`, this.Shapeconfig)
          this.reset()
          this.wmxData = []
          this.sizeForm.name = this.Shapeconfig.attrs.text
          this.sizeForm.dis = this.Shapeconfig.attrs.id
          this.sizeForm.isdis = true
        }
      },
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.Shapeconfig = {}
      },
      // 提交
      submitForm(sizeForm) {
        var obj = {
          name: sizeForm.name,
          dataForm: {
            round: sizeForm.round,
            order: sizeForm.order,
            data: sizeForm.dinumber,
            address: sizeForm.dis,
            quantity: sizeForm.dinumber,
            rate: sizeForm.rate,
            offset: sizeForm.offset,
            byteorder: sizeForm.byteorder,
            protocol: sizeForm.protocol,
            operatetype: sizeForm.operatetype,
            originaltype: sizeForm.originaltype,
            slaveid: sizeForm.slaveid,
            collection: sizeForm.collection,
            control: sizeForm.control,
            strategy: sizeForm.strategy,
          },
          required: true,
          accessMode: sizeForm.isread,
          identifier: sizeForm.identifier,
        }
        // 提交之前需要先判断类型
        if (
          sizeForm.type == 'float' ||
          sizeForm.type == 'double' ||
          sizeForm.type == 'int'
        ) {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                max: sizeForm.endnumber,
                min: sizeForm.startnumber,
                step: sizeForm.step,
                unit: sizeForm.unit == '' ? '' : sizeForm.unit,
              },
            },
          }
          Object.assign(obj, obj1)
          // 去除多余的属性
          if (!this.showNewItem) {
            delete obj.dataForm.operatetype
            delete obj.dataForm.originaltype
            delete obj.dataForm.slaveid
          }
        } else if (sizeForm.type == 'bool') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: {
                0: sizeForm.false,
                1: sizeForm.true,
              },
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'enum') {
          var specs = {}
          sizeForm.struct.map((items) => {
            var newkey = items['attribute']
            specs[newkey] = items['attributevalue']
          })
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: specs,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'struct') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              specs: sizeForm.struct,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'string') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
              size: sizeForm.string,
            },
          }
          Object.assign(obj, obj1)
        } else if (sizeForm.type == 'date') {
          var obj1 = {
            dataType: {
              type: sizeForm.type.toLowerCase(),
            },
          }
          Object.assign(obj, obj1)
        }
        // 检测到
        if (this.wmxSituation == '新增') {
          // console.log("新增");
          this.properties.push(obj)
        } else if (this.wmxSituation == '编辑') {
          // console.log("编辑" + obj);
          this.properties.forEach((rowData, index) => {
            if (rowData.identifier === obj.identifier) {
              this.propertie[index] = obj
            }
          })
        }
        const params = {
          thing: { properties: this.properties },
        }
        this.$update_object('Product', this.$route.query.productid, params)
          .then((resultes) => {
            if (resultes) {
              this.$message({
                type: 'success',
                message: this.wmxSituation + '成功',
              })
              this.wmxdialogVisible = false
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
      selectStruct() {},
      wmxCurrentChange() {},
      wmxSizeChange() {},
      isShowItem(lable) {
        return !this.ShowItem.includes(lable)
      },
      isdisabled(lable) {
        return this.disableLable.includes(lable)
      },
      isShowLable(disabled) {
        return !this.hideLable.includes(disabled)
      },
      updataImg(img) {
        // 触发父组件更新事件
        this.$emit('upImg', img)
      },
      saveKonvaitem(config) {
        // 触发父组件更新事件
        this.$emit('upconfig', config)
      },
      clearImg() {
        this.isVisible = !this.isVisible
        this.$emit('clearImg', this.isVisible)
      },
      upload() {
        this.$refs['upload'].$children[0].$refs.input.click()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        )
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang="scss" scoped>
  .operation {
    height: calc(100vh - #{$base-top-bar-height} * 4 - -25px);
    margin-left: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    color: wheat;
  }

  ::v-deep .jsoneditor-vue {
    height: calc(100vh - #{$base-top-bar-height} * 5 - 10px);
  }

  ::v-deep .json-save-btn {
    cursor: pointer;
  }
</style>
