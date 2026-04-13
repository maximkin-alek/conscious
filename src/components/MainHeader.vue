<template>
  <div>
    <header class="header">
      <div class="header-inner">
        <div class="logo-group">
          <span class="logo-icon">🌿</span>
          <h1 class="title">Выбирайте осознанно</h1>
        </div>
        <nav class="header-links">
          <router-link class="header-link" to="/">
            <span class="link-text">Главная</span>
          </router-link>
          <router-link class="header-link" to="/about">
            <span class="link-text">О проекте</span>
          </router-link>
        </nav>
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
  background: var(--color-forest);
  min-height: 72px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-medium);
}

.header-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  font-size: 28px;
  filter: grayscale(0.1);
}

.title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  color: var(--color-sand-light);
  letter-spacing: 0.5px;
  margin: 0;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-link {
  position: relative;
  padding: 10px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-sand);
  text-decoration: none;
  border-radius: var(--radius-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.header-link::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.08);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-link:hover::before {
  transform: scaleX(1);
}

.header-link:hover .link-text {
  color: var(--color-sand-light);
}

.header-link.router-link-active .link-text {
  color: var(--color-terracotta-light);
}

.link-text {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
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
