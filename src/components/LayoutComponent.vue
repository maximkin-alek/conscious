<template>
  <div>
    <main-header @onMobileMenuButtonClick="handleMobileMenuButtonClick" />
    <v-navigation-drawer height="400px" v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item @click="$router.push({ name: 'main' })">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$router.push({ name: 'about' })">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>О проекте</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
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
      group: null,
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
  },
};
</script>

<style lang="scss" scoped></style>
