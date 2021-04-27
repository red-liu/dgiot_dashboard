<template>
  <div class="_vuekonva">
    <div class="_drawer">
      <el-drawer
        :with-header="false"
        size="40%"
        :visible.sync="drawer"
        direction="rtl"
      >
        <websocket :topic="topic" />
      </el-drawer>
    </div>
    <div class="_header">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-button
                type="success"
                icon="el-icon-setting"
                @click="drawerFlag"
              >
                websocket
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="productid.length < 0"
                @click="subscribeMqtt(LayerData)"
              >
                订阅mqtt
              </el-button>
              <el-button
                icon="el-icon-document-add"
                :disabled="stop_Mqtt"
                @click="handleCloseSub()"
              >
                取消订阅mqtt
              </el-button>
            </el-col>
            <el-col :span="4">
              自动刷新
              <el-switch
                v-model="value"
                :disabled="productid.length < 0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="关闭"
                inactive-text="开启"
                @change="stopsub"
              />
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="_mian">
      <el-row :gutter="24" class="_row">
        <el-col :span="3">
          <div class="_left">物模型</div>
        </el-col>
        <el-col :span="18" class="_konvarow">
          <div ref="konva" class="konva _center"></div>
          <div class="_info">
            <el-row :gutter="10">
              <el-col :span="6"><span>已选{{}}</span></el-col>
              <el-col :span="4">
                <el-button
                  type="success"
                  plain
                  :disabled="productid.length < 1"
                  @click="preview('save')"
                >
                  保存
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button
                  type="primary"
                  :disabled="productid.length < 1"
                  plain
                  @click="preview('info')"
                >
                  当前数据
                </el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="info" plain @click="preview('search')">
                  分享
                </el-button>
              </el-col>
              <el-col :span="6">
                <vab-slider v-model="per" :min="0" :max="100" />
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="_right">操作</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { createShape, updateShape, setText } from '@/utils/konva'
  import websocket from '@/views/tools/websocket'
  import { isBase64 } from '@/utils'
  import { Websocket, sendInfo } from '@/utils/wxscoket.js'
  import { _getTopo } from '@/api/Topo'
  import { putDevice } from '@/api/Device'
  import { putProduct, queryProduct } from '@/api/Product'
  export default {
    components: {
      websocket,
    },
    data() {
      return {
        per: '100',
        paramsconfig: {},
        productconfig: {},
        activeNames: [],
        productid: this.$route.query.productid || '',
        konva: [],
        textConfig: [],
        imgConfig: [],
        rectConfig: [],
        LayerData: [],
        drawer: false,
        topic: '',
        stop_Mqtt: true,
        subdialogtimer: null,
        rules: {
          url: [{ required: true, message: '请输入url', trigger: 'blur' }],
          topic: [{ required: true, message: '请输入topic', trigger: 'blur' }],
        },
        subdialogid: 'subdialogid',
        layer: {},
        group: {},
        stagedefault: [],
        simpleText: {},
        text: '',
        stopValue: '',
        form: {
          url: '',
          topic: '',
        },
        value: false,
        formLabelWidth: '80px',
      }
    },
    computed: {
      stageConfig() {
        let el = document.getElementsByClassName('konva')
        return {
          width: el[0].clientWidth,
          height: el[0].clientHeight,
          container: 'container',
          id: 'container',
        }
      },
    },
    mounted() {
      this.handleCloseSub()
      if (this.productid) {
        this.createKonva()
        console.log('订阅mqtt消息')
      } else {
        this._initCreate()
      }
    },
    destroyed() {
      this.handleCloseSub()
    },
    methods: {
      // 预览
      preview(type) {
        switch (type) {
          case 'save':
            this.updataProduct(this.$route.query.productid)
            break
          case 'info':
            alert(this.stage.toJSON())
            break
          case 'search':
            this.$message.success('开发中')
            break
        }
      },
      // 更新产品
      async updataProduct(productid) {
        console.log('updatatopo')
        const { config } = this.productconfig
        // 提交前需要先对数据进行合并
        let upconfig = Object.assign(config, this.paramsconfig)
        let params = {
          config: upconfig,
        }
        let res = await putProduct(productid, params)
        console.log(res)
        this.$message.success('产品组态更新成功')
      },
      // 订阅mqtt
      subscribeMqtt(data = []) {
        this.subscribe(this.productid)
        // data.forEach((item) => {
        //   if (item.id) {
        //     this.subscribe(item.id)
        //   }
        // })
      },
      // 处理mqtt信息
      handleMqttMsg(subdialogid) {
        var submessage = ''
        var channeltopic = new RegExp('thing/' + subdialogid + '/post')
        Websocket.add_hook(channeltopic, (Msg) => {
          console.log('收到消息', Msg)
          if (!isBase64(Msg)) {
            console.log('非base64数据类型')
            return
          }
          let decodeMqtt = JSON.parse(Base64.decode(Msg))
          console.log(decodeMqtt.konva)
          const Shape = decodeMqtt.konva.Shape
          const stagedefault = this.stagedefault
          if (Shape) {
            updateShape(Shape)
              .then((result) => {
                console.log(result)
                console.log('konva数据更新成功')
              })
              .catch((err) => {
                console.log('konva数据更新失败', err)
              })
          }
        })
      },
      // 取消订阅mqtt
      handleCloseSub() {
        this.stop_Mqtt = true
        var text0 = JSON.stringify({ action: 'stop_logger' })
        var sendInfo = {
          topic: 'thing/' + this.productid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.unsubscribe(sendInfo, (res) => {
          console.log('取消订阅mqtt', res.msg)
        })
      },
      // 是否自动刷新mqtt消息
      stopsub(value) {
        var text0
        if (value == false) {
          // this.subaction = 'start'
          text0 = JSON.stringify({ action: 'stop_logger' })
        } else {
          // this.subaction = 'stop'
          text0 = JSON.stringify({ action: 'start_logger' })
        }
        var sendInfo = {
          topic: 'thing/' + this.productid + '/post',
          text: text0,
          retained: true,
          qos: 2,
        }
        Websocket.sendMessage(sendInfo)
      },
      // 打开websocket
      drawerFlag() {
        this.topic = `thing/${this.productid}/post`
        this.drawer = true
      },
      // mqtt订阅
      subscribe(subdialogid) {
        var info = {
          topic: `thing/${this.productid}/post`,
          qos: 2,
        }
        Websocket.subscribe(info, (res) => {
          if (res.result) {
            // thing/9c5930e565/9CA525B343F0/post
            this.$message(`订阅成功 topic: ${info.topic}`, 'sussess')
            this.stop_Mqtt = false
          } else {
            this.$message('订阅失败,请手动订阅mqtt', 'error')
            this.subscribeMqtt([])
          }
        })
      },
      handleClose() {},
      // 新增文本
      _addText() {
        let text = createText({})
        this.layer.add(text)
        this.stage.add(this.layer)
      },
      // 设置文本
      async _setText(id, text) {
        console.log(this.stage.find(`#${id}`)[0])
        const { tween } = await setText(this.stage.find(`#${id}`)[0], text)
        console.log(tween)
      },
      _initCreate() {
        let background =
          'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png'
        console.log(' this.$refs.konva', this.$refs.konva)
        this.$refs.konva.style.backgroundImage = `url(${background})`
      },
      // js 绘制
      async createKonva() {
        const { productid, devaddr = undefined } = this.$route.query
        let params = {
          productid: productid,
          devaddr: devaddr,
        }
        // const { msg = '' } = await _getTopo(params)
        const { message = '', data } = await _getTopo(params)
        // 绘制前不光需要获取到组态数据，还需要获取产品数据
        const { results } = await queryProduct({
          where: { objectId: this.productid },
        })
        this.productconfig = results[0]
        console.log(this.productconfig)
        if (message == 'SUCCESS') {
          console.log(data)
          this.paramsconfig = { konva: data }
          //
          if (this.$route.query.type == 'device') {
            this.productid = this.$route.query.deviceid
          }
          this.handleMqttMsg(this.productid)
          // set backgroundImage
          console.log(data)
          const {
            background = '',
            Shape = [],
            Group = {},
            Layer = {},
            Stage = {},
          } = data
          // 生成页面canvas组
          console.log(Stage, 'container')
          var _konvarow = document.querySelectorAll('._center')[0]
          let div = document.createElement('div')
          div.setAttribute('id', Stage.container)
          _konvarow.append(div)
          this.stagedefault = Shape
          // this.$refs.konva.style.backgroundImage = `url(${background})`
          this.stage = new Konva.Stage(Object.assign(this.stageConfig, Stage))
          let layer = new Konva.Layer(Layer)
          // create group
          let group = new Konva.Group(Object.assign(Group))
          // this.layer.add(createText(data.Layer))
          // create Shape
          let _Shape = createShape(group, Shape)
          layer.add(_Shape)
          layer.batchDraw()
          this.stage.add(layer)
          console.log('绘制完成')
          this.$nextTick(() => {
            this.subscribe(this.productid)
          })
        } else {
          this._initCreate()
        }
      },
      //
    },
  }
</script>
<style lang="scss" scoped>
  ._vuekonva {
    ::v-deep .el-drawer__body {
      overflow-x: auto;
      overflow-y: auto;
    }
    width: 100%;
    height: calc(100vh - 211px);
    ._drawer {
      width: 100%;
    }
    ._header {
      width: 100%;
    }
    ._mian {
      ._row {
        ._konvarow {
          padding: 0 !important;
          // border: 1px solid red;
          box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
          .konva {
            min-width: 100vh;
            min-height: calc(100vh - 260px);
            // background-image: url('http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/konva/assets/taiti.png');
            background-size: 100% 100%;
          }
        }
        ._info {
          position: relative;
          height: 40px;
          background-color: white;
          border-top: 1px solid rgb(204, 204, 204);
        }
      }
    }
  }
</style>
