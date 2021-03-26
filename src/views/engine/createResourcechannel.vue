<template>
  <div class="createResourcechannel">
    <el-form
      ref="addchannel"
      :rules="addrules"
      label-width="auto"
      :model="addchannel"
      size="mini"
    >
      <el-form-item
        :label="$translateTitle('developer.channelname')"
        prop="name"
      >
        <el-input
          v-model="addchannel.name"
          style="float: left"
          :placeholder="$translateTitle('developer.channelname')"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请选择所属应用', trigger: 'blur' },
        ]"
        label="所属应用"
      >
        <el-input
          v-model="addchannel.applicationtText"
          placeholder="请选择所属应用"
          readonly
        >
          <template slot="append">
            <i
              :class="[showTree ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
              style="cursor: pointer"
              @click="showTree = !showTree"
            />
          </template>
        </el-input>
        <div v-if="showTree" class="device-tree">
          <el-tree
            default-expand-all="true"
            :data="allApps"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-col v-for="(item, index) in arrlist" :key="index" :span="12">
        <el-form-item
          :label="item.title.zh"
          :required="item.required"
          :prop="item.showname"
        >
          <el-input
            v-if="item.type == 'string'"
            v-model="addchannel[item.showname]"
          />
          <el-input
            v-else-if="item.type == 'integer'"
            v-model.number="addchannel[item.showname]"
          />
          <el-select
            v-else-if="item.type == 'boolean'"
            v-model="addchannel[item.showname]"
            class="notauto"
            readonly
          >
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-form-item label="通道类型" prop="region">
        <el-select
          v-model="addchannel.region"
          placeholder="通道类型"
          @change="removeauto"
        >
          <el-option
            v-for="(item, index) in channelregion"
            :key="index"
            :label="item.title.zh"
            :value="item.cType"
          />
        </el-select>
        <el-row
          :gutter="24"
          style="
            width: 100%;
            max-height: 500px;
            overflow-x: hidden;
            overflow-y: scroll;
            line-height: 30px;
            text-align: center;
          "
        >
          <el-col
            v-for="(item, index) in channelregion"
            :key="index"
            :span="8"
            style="margin: 20px 0; cursor: pointer"
          >
            <el-card
              :shadow="addchannel.region == item.cType ? 'always' : 'hover'"
              :style="{
                color: addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',
              }"
              size="mini"
              class="box-card"
            >
              <div slot="header" class="clearfix">
                <span>{{ item.title.zh }}</span>
                <el-button
                  :disabled="resourceid != ''"
                  :type="
                    addchannel.region == item.cType ? 'success' : 'primary'
                  "
                  size="mini"
                  style="float: right"
                  @click="setCard(item.cType)"
                >
                  {{ addchannel.region == item.cType ? '已选' : '选择' }}
                </el-button>
              </div>
              <div class="text item">
                <el-row :gutter="24">
                  <el-col :span="12">
                    <img
                      :src="
                        item.params.ico.default ? item.params.ico.default : ''
                      "
                      class="image"
                      style="width: 50px; height: 50px"
                    />
                  </el-col>
                  <el-col :span="12">
                    <el-tag>{{ item.cType }}</el-tag>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { Roletree } from '@/api/Menu/index'
  import { resourceTypes } from '@/api/Rules'
  export default {
    name: 'CreateResourcechannel',
    components: {},
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        showTree: false,
        allApps: [],
        arrlist: [],
        addrules: {
          roles: [
            { required: true, message: '请选择所属应用', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择服务类型', trigger: 'change' },
          ],
        },
        addchannel: {
          name: '',
        },
      }
    },
    computed: {},
    mounted() {
      this.getRole()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      handleNodeClick(data) {
        this.showTree = !this.showTree
        this.addchannel.applicationtText = data.alias
      },
      async getRole() {
        const { results = [] } = await Roletree()
        this.allApps = results
        const res = await resourceTypes()
        this.channelregion = res
        console.log('this.channelregion', this.channelregion)
      },
      onSubmit() {
        console.log('submit!')
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  /* @import url() */
  .createResourcechannel {
    margin: 20px;
    .device-tree {
      height: 200px;
      overflow: auto;
      ::v-deep .el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      ::v-deep .el-tree > .el-tree-node {
        height: 200px; //这里的高根据实际情况
        min-width: 100%;
        display: inline-block;
      }
    }
  }
</style>
