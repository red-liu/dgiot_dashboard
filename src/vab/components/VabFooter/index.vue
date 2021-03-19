<template>
  <footer class="vab-footer">
    <vab-icon icon="copyright-line" />
    {{ Default.copyright }}
  </footer>
</template>

<script>
  import { title } from '@/config'
  import { mapGetters } from 'vuex'
  export default {
    name: 'VabFooter',
    data() {
      return {
        fullYear: new Date().getFullYear(),
        title,
      }
    },
    computed: {
      ...mapGetters({
        Default: 'acl/Default',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    background: $base-color-white;
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
</style>
