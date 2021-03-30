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
  import { randomHexColor, randomNum } from '@/utils'
  export default {
    data() {
      return {
        configKonva: {
          width: 200,
          height: 200,
        },
        configCircle: {
          id: 'testId',
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
        let toJSON = el.getStage().toJSON()
        console.log(toJSON)
        this.configCircle = {
          id: 'testId111',
          x: randomNum(0, 100),
          y: randomNum(0, 100),
          radius: randomNum(0, 100),
          fill: randomHexColor(),
          stroke: randomHexColor(),
          strokeWidth: randomNum(0, 100),
        }
        // console.log(el.create())
      },
    },
  }
</script>
