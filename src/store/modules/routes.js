/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { errorRoutes } from '@/config/router.config'
import { getRouterList } from '@/api/User'
import { convertRouter, filterRoutes } from '@/utils/routes'
const state = () => ({
  routes: [],
  cachedRoutes: [],
})
const getters = {
  routes: (state) => state.routes,
  cachedRoutes: (state) => state.cachedRoutes,
}
const mutations = {
  /**
   * @description 多模式设置路由
   * @param {*} state
   * @param {*} routes
   */
  setRoutes(state, routes) {
    state.routes = routes
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} state
   * @param {*} routes
   */
  setCachedRoutes(state, routes) {
    state.cachedRoutes = routes
  },
  /**
   * @description 修改Meta
   * @param {*} state
   * @param options
   */
  changeMenuMeta(state, options) {
    function handleRoutes(routes) {
      return routes.map((route) => {
        if (route.name === options.name) Object.assign(route.meta, options.meta)
        if (route.children && route.children.length)
          route.children = handleRoutes(route.children)
        return route
      })
    }

    state.routes = handleRoutes(state.routes)
  },
}
const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'none') {
    // 默认前端路由
    let routes = [...asyncRoutes]
    // 设置后端路由(不需要可以删除)
    const { results } = await getRouterList()
    if (!results) {
      Vue.prototype.$baseMessage(
        '路由未正常返回！',
        'error',
        false,
        'vab-hey-message-error'
      )
      return false
    }
    /**
     * 处理路由
     */
    let data = []
    results.forEach((item, key) => {
      if (item.children) {
        item.children.forEach((i, k) => {
          i.hidden = i.meta.hidden || false
          i.menuHidden = i.meta.menuHidden || false
          i.alwaysShow = i.meta.alwaysShow || false
          i.name = i.name
          i.path = i.url
          i.component = i.meta.component
          i.meta.title = i.meta.title
          i.meta.icon = i.meta.icon
        })
      }
      if (item.meta.redirect) {
        data.push({
          hidden: item.meta.hidden || false,
          menuHidden: item.meta.menuHidden || false,
          alwaysShow: item.meta.alwaysShow || false,
          name: item.name,
          path: item.url,
          component: item.meta.component,
          redirect: item.meta.redirect,
          meta: {
            title: item.meta.title,
            icon: item.meta.icon,
          },
          children: item.children,
        })
      } else {
        data.push({
          hidden: item.hidden || false,
          menuHidden: item.menuHidden || false,
          alwaysShow: item.alwaysShow || false,
          name: item.name,
          path: item.url,
          component: item.meta.component,
          meta: {
            title: item.meta.title,
            icon: item.meta.icon,
          },
          children: item.children,
        })
      }
    })
    if (data[data.length - 1].path !== '*') {
      data.push(errorRoutes)
      console.log(data)
      routes = convertRouter(data)
    }

    // 根据权限和rolesControl过滤路由
    const finallyRoutes = filterRoutes([...constantRoutes, ...routes])
    // 设置菜单所需路由
    commit('setRoutes', finallyRoutes)
    // 根据可访问路由重置Vue Router
    await resetRouter(finallyRoutes)
  },
  /**
   * @description 设置缓存Name数组
   * @param {*} { commit }
   * @param {*} routes
   */
  setCachedRoutes({ commit }, routes) {
    commit('setCachedRoutes', routes)
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeMenuMeta({ commit }, options = {}) {
    commit('changeMenuMeta', options)
  },
}
export default { state, getters, mutations, actions }
