export default {
  namespaced: true,
  state: {
    isTimerStarted: false,
    timer: "",
  },

  getters: {
    getTimerState(state) {
      return state.isTimerStarted;
    },
    getTimerValue(state) {
      return state.timer;
    },
  },

  mutations: {
    SET_TIMER_STATE(state, payload) {
      state.isTimerStarted = payload;
    },
    SET_TIMER_VALUE(state, payload) {
      state.timer = payload;
    },
  },

  actions: {
    startTimer({ commit }, timeString) {
      commit("SET_TIMER_VALUE", timeString);
      commit("SET_TIMER_STATE", true);
    },

    stopTimer({ commit }) {
      commit("SET_TIMER_VALUE", "");
      commit("SET_TIMER_STATE", false);
    },
  },
};
