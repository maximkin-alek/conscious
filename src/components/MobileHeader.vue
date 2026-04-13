<template>
  <v-card class="mobile-header-card" elevation="0">
    <v-app-bar :color="'var(--color-forest)'" dark>
      <v-app-bar-nav-icon @click="onMobileMenuButtonClick"></v-app-bar-nav-icon>

      <v-toolbar-title class="mobile-title">
        <span class="title-icon">🌿</span>
        Выбирайте осознанно
      </v-toolbar-title>
    </v-app-bar>
  </v-card>
</template>

<style scoped>
.mobile-header-card {
  border-radius: 0 !important;
}

.mobile-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 22px;
}
</style>

<script setup>
const emit = defineEmits(["onMobileMenuButtonClick"]);

function onMobileMenuButtonClick() {
  emit("onMobileMenuButtonClick");
}
</script>
