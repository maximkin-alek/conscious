<template>
  <div class="layout-wrapper">
    <main-header @onMobileMenuButtonClick="handleMobileMenuButtonClick" />
    <v-navigation-drawer v-model="drawer" temporary class="mobile-drawer">
      <div class="drawer-header">
        <span class="drawer-icon">🌿</span>
        <span class="drawer-title">Меню</span>
      </div>
      <v-list nav density="comfortable" class="drawer-list">
        <v-list-item
          prepend-icon="mdi-home"
          title="Главная"
          @click="navigateTo('main')"
          class="drawer-item"
        />
        <v-list-item
          prepend-icon="mdi-robot"
          title="AI-чат"
          @click="navigateTo('main')"
          class="drawer-item"
        />
        <v-list-item
          prepend-icon="mdi-account"
          title="О проекте"
          @click="navigateTo('about')"
          class="drawer-item"
        />
      </v-list>
    </v-navigation-drawer>
    <v-main class="main-content">
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

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  background: var(--color-sand-light);
}

.mobile-drawer {
  background: var(--color-sand-light) !important;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--color-sand);
}

.drawer-icon {
  font-size: 28px;
}

.drawer-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--color-forest);
}

.drawer-list {
  padding: 12px;
}

.drawer-item {
  border-radius: var(--radius-soft);
  margin-bottom: 4px;
}

.drawer-item:hover {
  background: var(--color-sand) !important;
}

.main-content {
  background: transparent;
}
</style>
