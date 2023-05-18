import Vue from "vue";
import Vuex from "vuex";
import usefuls from "./usefuls";
import timer from "./timer";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: { usefuls, timer },
});

export default store;
