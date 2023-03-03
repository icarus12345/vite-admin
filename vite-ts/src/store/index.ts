import { createStore } from 'vuex'
import getters from './getters'
import app from './modules/app'
// import settings from './modules/settings'
import auth from './modules/auth'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    // app,
    // settings,
    // auth
  },
  getters,
  // plugins
})
