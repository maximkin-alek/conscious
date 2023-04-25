<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!harmful || !formIsValid"
        class="harmful-button"
        x-large
        type="submit"
        v-bind="attrs"
        v-on="on"
        >Начать</v-btn
      >
    </template>

    <v-card v-if="!isStarted">
      <v-card-title>Мой осознанный выбор:</v-card-title>
      <v-card-text
        >Потратить {{ time }} мин. на {{ harmful }} вместо
        {{ usefull }}</v-card-text
      >
      <v-btn @click="StartTimer">Начать</v-btn>
    </v-card>

    <div class="timer" v-if="isStarted">
      <flip-countdown
        :deadline="timer"
        :showDays="false"
        @timeElapsed="timeElapsedHandler"
      ></flip-countdown>
    </div>
  </v-dialog>
</template>

<script>
import FlipCountdown from "vue2-flip-countdown";
export default {
  data() {
    return {
      dialog: false,
      isStarted: false,
      timer: "",
    };
  },
  components: { FlipCountdown },
  props: {
    harmful: String,
    time: String,
    usefull: String,
    formIsValid: Boolean,
  },
  methods: {
    StartTimer() {
      const timeSplit = this.time.split(":");
      const timeHours = Number(timeSplit[0]);
      const timeMinutes = Number(timeSplit[1]);

      let timeString = "";
      timeString = this.$moment().add(timeMinutes, "minutes").format();

      if (timeHours) {
        timeString = this.$moment(timeString).add(timeHours, "hours").format();
      }
      timeString = timeString.split("T").join();
      console.log(timeString);
      this.timer = timeString;
      this.isStarted = true;
    },
    timeElapsedHandler() {
      alert("Время вышло!");
    },
  },
};
</script>

<style scoped>
.harmful-button {
  display: block;
  margin: 15px auto;
}

.timer {
  background: white;
}
</style>
