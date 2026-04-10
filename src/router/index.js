import { createRouter, createWebHashHistory } from "vue-router";
import AboutMe from "../pages/AboutMe.vue";
import MainPage from "../pages/MainPage.vue";
import LayoutComponent from "../components/LayoutComponent.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: LayoutComponent,
      children: [
        {
          path: "",
          name: "main",
          component: MainPage,
        },
        {
          path: "about",
          name: "about",
          component: AboutMe,
        },
        {
          path: "chat",
          name: "chat",
          redirect: { name: "main" },
        },
      ],
    },
  ],
});
