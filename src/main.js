import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

const pinia = createPinia();

createApp(App).use(router).use(store).use(pinia).use(vuetify).mount("#app");
