<template>
  <v-card class="mx-auto overflow-hidden">
    <v-app-bar color="#6bb5ff" dark>
      <v-app-bar-nav-icon @click="onMobileMenuButtonClick"></v-app-bar-nav-icon>

      <v-toolbar-title>Выбирайте осознанно</v-toolbar-title>
    </v-app-bar>
  </v-card>
</template>

<style scoped></style>

<script>
export default {
  methods: {
    onMobileMenuButtonClick() {
      this.$emit("onMobileMenuButtonClick");
    },
  },
};
</script>
