<template>
  <header class="header">
    <h1 class="title">Выбирайте осознанно</h1>
    <div class="header-links">
      <router-link class="header-link" to="/">Главная</router-link>
      <router-link class="header-link" to="/about">О проекте</router-link>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  background: #6bb5ff;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-link {
  font-size: 16px;
  font-style: italic;
  margin-right: 12px;
  color: #f7c08a;
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.header-link:hover {
  color: #eccfb2;
}

.header-link:last-of-type {
  margin-right: 0;
}

.title {
  color: #f7c08a;
}
</style>
