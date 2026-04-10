export default {
  namespaced: true,
  state: {
    usefulsList: [],
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
    async loadUsefuls({ commit }) {
      const res = await fetch("/api/usefuls", { method: "GET" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      if (json?.data && Array.isArray(json.data)) {
        commit("SET_USEFULS_LIST", json.data);
      }
    },

    async addUseful({ commit }, payload) {
      const name = typeof payload === "string" ? payload : "";
      const res = await fetch("/api/usefuls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.data && Array.isArray(json.data)) {
        commit("SET_USEFULS_LIST", json.data);
      }
    },

    async deleteUseful({ commit }, payload) {
      const name = typeof payload === "string" ? payload : "";
      const res = await fetch("/api/usefuls", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.data && Array.isArray(json.data)) {
        commit("SET_USEFULS_LIST", json.data);
      }
    },
  },
};
