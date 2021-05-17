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
        wmxSituation: '',
        wmxdialogVisible: false,
        sizeForm: { name: '1', identifier: '', type: 'int' },
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
      handleModule(e) {
        this.wmxdialogVisible = !e
        const { thing = { properties: [] } } = this.productconfig
        let properties = thing.properties
        console.log(properties)
        console.log(this.Shapeconfig)
        if (properties.length) {
          let _fortype = properties.some((e) => {
            return e.dataForm.address === this.Shapeconfig.attrs.id
          })
          if (_fortype) {
            properties.forEach((item) => {
              if (item.dataForm.address === this.Shapeconfig.attrs.id) {
                console.log(`物模型存在这个属性`, item)
                this.wmxData = item
                this.sizeForm.dis = item.attrs.id
              }
            })
          } else {
            console.log('物模型不为空，但不存在这个属性', this.Shapeconfig)
            this.sizeForm.dis = this.Shapeconfig.attrs.id
            this.wmxData = []
          }
        } else {
          console.log(`物模型为空`, this.Shapeconfig)
          this.sizeForm.dis = this.Shapeconfig.attrs.id
          this.wmxData = []
        }
      },
      wmxhandleClose() {
        this.wmxdialogVisible = false
        this.Shapeconfig = {}
      },
      // 提交
      submitForm(from) {
        console.log('from', from)
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
    height: calc(100vh - #{$base-top-bar-height}* 4 - -25px);
    margin-left: 10px;
    overflow-x: hidden;
    overflow-y: scroll;
    color: wheat;
  }
  ::v-deep .jsoneditor-vue {
    height: calc(100vh - #{$base-top-bar-height}* 5 - 10px);
  }
  ::v-deep .json-save-btn {
    cursor: pointer;
  }
</style>
