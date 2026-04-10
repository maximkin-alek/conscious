export default {
  namespaced: true,
  state: {
    tasksList: [],
  },
  getters: {
    getTasksList(state) {
      return state.tasksList;
    },
  },
  mutations: {
    SET_TASKS_LIST(state, payload) {
      state.tasksList = payload;
    },
  },
  actions: {
    async loadTasks({ commit }) {
      const res = await fetch("/api/tasks", { method: "GET" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      if (json?.data && Array.isArray(json.data)) {
        commit("SET_TASKS_LIST", json.data);
      }
    },

    async addTask({ commit }, payload) {
      const name = typeof payload === "string" ? payload : "";
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.data && Array.isArray(json.data)) {
        commit("SET_TASKS_LIST", json.data);
      }
    },

    async deleteTask({ commit }, payload) {
      const name = typeof payload === "string" ? payload : "";
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.data && Array.isArray(json.data)) {
        commit("SET_TASKS_LIST", json.data);
      }
    },
  },
};
