const state = {
    show: false
  }
  
  const mutations = {
    TOGGLE_SIDEBAR: (state: any) => {
      state.show = true
    },
    CLOSE_SIDEBAR: (state: any) => {
        state.show = false
    },
    TOGGLE_DEVICE: (state: any, device: any) => {
      state.device = device
    }
  }
  
  const actions = {
    toggleSideBar({ commit }: any) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }: any, {  }) {
      commit('CLOSE_SIDEBAR')
    },
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  