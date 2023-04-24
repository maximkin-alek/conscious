import Vue from "vue";
import App from "./App.vue";

import VueRouter from "vue-router";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store/index";

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  el: "#app",
  vuetify,
  store,
  router,
});
