import Vue from "vue";
import VueRouter from "vue-router";
import AboutMe from "../pages/AboutMe";
import MainPage from "../pages/MainPage";
import LayoutComponent from "../components/LayoutComponent.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",

  routes: [
    {
      path: "/",
      component: LayoutComponent,
      children: [
        {
          path: "/",
          name: "main",
          component: MainPage,
        },
        {
          path: "/about",
          name: "about",
          component: AboutMe,
        },
      ],
    },
  ],
});

export default router;
