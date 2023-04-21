import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    usefulsList: ["Почитать", "Заняться спортом", "Заняться английским"],
  },
  getters: {
    getUsefulsList(state) {
      return state.usefulsList;
    },
  },
  mutations: {
    SET_USEFULS_LIST(state, payload) {
      state.usefulsList = payload;
    },
  },
  actions: {
    addUseful({ commit, state }, payload) {
      if (state.usefulsList.includes(payload)) {
        return;
      }
      const arr = state.usefulsList.concat(payload);
      commit("SET_USEFULS_LIST", arr);
    },
  },
});

export default store;
