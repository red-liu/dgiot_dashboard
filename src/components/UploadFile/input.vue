<template>
  <div>
    <input
      ref="uploader"
      type="file"
      style="display: none"
      @change="doUpload($event)"
    />
    <div v-if="fileFlag">
      <i
        class="el-icon-close"
        style="position: relative; top: 20px; left: 101px"
        @click="remove"
      ></i>
      <img :src="url" style="width: 100px; height: 100px" />
    </div>
  </div>
</template>

<script>
  // import x from ''
  export default {
    name: 'Input',
    components: {},
    data() {
      return {
        fileFlag: false, //是否上传成功
        url: '', //上传后的文件url
      }
    },
    computed: {},
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
