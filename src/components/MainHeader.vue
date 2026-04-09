<template>
  <div>
    <header class="header">
      <h1 class="title">Выбирайте осознанно</h1>
      <div class="header-links">
        <router-link class="header-link" to="/">Главная</router-link>
        <router-link class="header-link" to="/about">О проекте</router-link>
      </div>
    </header>
    <mobile-header
      @onMobileMenuButtonClick="onMobileMenuButtonClick"
      class="mobile-header"
    />
  </div>
</template>

<script setup>
import MobileHeader from "../components/MobileHeader.vue";

const emit = defineEmits(["onMobileMenuButtonClick"]);

function onMobileMenuButtonClick() {
  emit("onMobileMenuButtonClick");
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-link {
  font-size: 16px;
  font-weight: 600;
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.header-link:hover {
  color: #ffffff;
}

.header-link:last-of-type {
  margin-right: 0;
}

.title {
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.2px;
}
.mobile-header {
  display: none;
}
@media screen and (max-width: 500px) {
  .header {
    display: none;
  }
  .mobile-header {
    display: block;
  }
}
</style>
