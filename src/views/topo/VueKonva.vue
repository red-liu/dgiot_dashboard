<template>
  <div class="app-container">
    <div><h1>旋转动画</h1></div>
    <div id="container" ref="container" class="container" @click="printNode" />
  </div>
</template>

<script>
  import { konva } from '@/mixins'
  import Konva from 'konva'

  export default {
    name: 'TweenFilter',
    mixins: [konva],
    data() {
      return {}
    },
    created() {
      // 因为第一个图层是10ms后创建的,避免图层未创建问题
      setTimeout(() => {
        this.addElem()
      }, 20)
    },
    methods: {
      printNode() {
        console.log(this.$refs.container)
      },
      /**
       * 按钮--创建图形 yyshu 20201101
       */
      addElem() {
        const layer = this.pageLayer[0].layer
        const blueHex = new Konva.RegularPolygon({
          x: 50,
          y: 200,
          sides: 6,
          radius: 40,
          fill: '#00D2FF',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
        })

        const yellowHex = new Konva.RegularPolygon({
          x: 150,
          y: 200,
          sides: 6,
          radius: 50,
          fill: 'yellow',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
        })

        const redHex = new Konva.RegularPolygon({
          x: 300,
          y: 200,
          sides: 6,
          radius: 50,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          offset: {
            x: 50,
            y: 0,
          },
          draggable: true,
        })

        layer.add(blueHex)
        layer.add(yellowHex)
        layer.add(redHex)

        const period = 2000

        const anim = new Konva.Animation(function (frame) {
          const scale = Math.sin((frame.time * 2 * Math.PI) / period) + 0.001
          // scale x and y
          blueHex.scale({ x: scale, y: scale })
          // scale only y
          yellowHex.scaleY(scale)
          // scale only x
          redHex.scaleX(scale)
        }, layer)
        anim.start()
      },
    },
  }
</script>
