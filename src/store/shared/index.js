export default {
  state: {
    error: {
      status: false,
      textMessage: ''
    },
    loading: false
  },
  mutations: {
    cleanError (state) {
      state.error = {
        status: false,
        textMessage: ''
      }
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    }
  },
  actions: {
    cleanError (context) {
      context.commit('cleanError')
    },
    setError (context, payload) {
      const setError = {
        status: payload.status,
        textMessage: payload.textMessage
      }
      context.commit('setError', setError)
    }
  },
  getters: {
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
}
