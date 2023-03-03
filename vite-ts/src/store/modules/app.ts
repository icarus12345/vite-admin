const state = {
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') ? !!localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: (state: any) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      localStorage.setItem('sidebarStatus', '1')
    } else {
      localStorage.setItem('sidebarStatus', '0')
    }
  },
  CLOSE_SIDEBAR: (state: any) => {
    localStorage.setItem('sidebarStatus', '0')
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
