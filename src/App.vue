<template>
  <v-app>
    <main-page />
  </v-app>
</template>

<script>
import MainPage from "./components/MainPage";

export default {
  name: "App",

  components: {
    "main-page": MainPage,
  },

  data: () => ({
    //
  }),
};
</script>
