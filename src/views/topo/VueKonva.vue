<template>
  <div>
    <v-stage ref="stage" :config="configKonva">
      <v-layer>
        <v-circle :config="configCircle" />
      </v-layer>
    </v-stage>
    <el-button type="primary" plain @click="getRef">getRef</el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        configKonva: {
          width: 200,
          height: 200,
        },
        configCircle: {
          x: 100,
          y: 100,
          radius: 70,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
        },
      }
    },
    methods: {
      getRef() {
        const el = this.$refs['stage']
        console.log(el.getNode().cache())
        console.log(el.getStage().toJSON())
        el.create(
          {
            attrs: { width: 200, height: 200 },
            className: 'Stage',
            children: [
              {
                attrs: {},
                className: 'Layer',
                children: [
                  {
                    attrs: {
                      x: 100,
                      y: 100,
                      radius: 70,
                      fill: 'pink',
                      stroke: 'black',
                      strokeWidth: 4,
                    },
                    className: 'Circle',
                  },
                ],
              },
            ],
          },
          'Stage'
        )
        // console.log(el.create())
      },
    },
  }
</script>
