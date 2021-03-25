/**
 * use
 */
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
import VueKonva from 'vue-konva'
import topology from 'topology-vue'
import 'topology-vue/topology-vue.css'
import '@/vab'

/**
 * use
 */

Vue.use(utilwen)
Vue.use(VueKonva)
Vue.use(topology)
Vue.config.productionTip = false
new Vue({
  el: '#dgiot',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
