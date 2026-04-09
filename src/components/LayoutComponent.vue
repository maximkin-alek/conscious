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

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainHeader from "../components/MainHeader.vue";

const router = useRouter();

const drawer = ref(false);

function handleMobileMenuButtonClick() {
  drawer.value = true;
}

function navigateTo(name) {
  drawer.value = false;
  router.push({ name });
}
</script>

<style lang="scss" scoped></style>
