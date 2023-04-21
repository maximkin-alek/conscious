import Vue from "vue";
import Vuex from "vuex";
import usefuls from "./usefuls";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { usefuls },
});

export default store;
