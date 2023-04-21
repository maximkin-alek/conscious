<template>
  <v-dialog v-model="dialog" max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="harmful-button"
        x-large
        type="submit"
        v-bind="attrs"
        v-on="on"
        >Начать</v-btn
      >
    </template>
    <v-card>
      <v-card-title>Мой осознанный выбор:</v-card-title>
      <v-card-text
        >Потратить {{ time }} мин. на {{ harmful }} вместо
        {{ usefull }}</v-card-text
      >
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  props: {
    harmful: String,
    time: String,
    usefull: String,
  },
};
</script>

<style scoped>
.harmful-button {
  display: block;
  margin: 15px auto;
}
</style>
