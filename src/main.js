import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import utilwen from './utils/utilwen'
import '@/vab'
Vue.use(utilwen)

Vue.config.productionTip = false
new Vue({
  el: '#dgiot',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
