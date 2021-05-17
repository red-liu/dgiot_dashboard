const state = () => ({
  graphColor: 'red',
  drawing: false,
  pointStart: [],
  graphNow: null,
  draw: [],
  flag: null,
  drawParams: {},
})
const getters = {
  graphColor: (state) => state.graphColor,
  drawing: (state) => state.drawing,
  pointStart: (state) => state.pointStart,
  draw: (state) => state.draw,
  graphNow: (state) => state.graphNow,
  flag: (state) => state.flag,
  drawParams: (state) => state.drawParams,
}
const mutations = {
  setGraphColor(state, color) {
    state.graphColor = color
  },
  setDrawing(state, draw) {
    state.drawing = draw
  },
  setPointStart(state, point) {
    state.pointStart = point
  },
  setGraphNow(state, Now) {
    state.graphNow = Now
  },
  setDraw(state, draw) {
    state.draw = draw
  },
  setFlag(state, flag) {
    state.flag = flag
  },
  setDrawParams(state, params) {
    state.drawParams = params
  },
}
const actions = {
  setGraphColor({ commit }, color) {
    commit('setGraphColor', color)
  },
  setDrawing({ commit }, draw) {
    commit('setDrawing', draw)
  },
  setPointStart({ commit }, point) {
    commit('setPointStart', point)
  },
  setGraphNow({ commit }, Now) {
    commit('setGraphNow', Now)
  },
  setDraw({ commit }, draw) {
    commit('setDraw', draw)
  },
  setFlag({ commit }, flag) {
    commit('setFlag', flag)
  },
  setDrawParams({ commit }, params) {
    commit('setDrawParams', params)
  },
}
export default { state, getters, mutations, actions }
