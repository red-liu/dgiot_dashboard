/*
 * @Author: h7ml
 * @Date: 2021-01-14 14:35:36
 * @LastEditTime: 2021-03-15 16:24:35
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\store\index.js
 * @Description:
 */
/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */

Vue.use(Vuex)
const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})
console.log(modules)
const store = new Vuex.Store({
  modules,
})
export default store
