<template>
  <div>
    <main-header @onMobileMenuButtonClick="handleMobileMenuButtonClick" />
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav density="compact">
        <v-list-item
          prepend-icon="mdi-home"
          title="Главная"
          @click="navigateTo('main')"
        />
        <v-list-item
          prepend-icon="mdi-account"
          title="О проекте"
          @click="navigateTo('about')"
        />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import MainHeader from "../components/MainHeader.vue";
export default {
  data() {
    return {
      drawer: false,
    };
  },
  components: {
    "main-header": MainHeader,
  },
  methods: {
    handleMobileMenuButtonClick() {
      this.drawer = true;
    },
    navigateTo(name) {
      this.drawer = false;
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="scss" scoped></style>
