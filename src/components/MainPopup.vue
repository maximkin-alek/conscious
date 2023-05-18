<template>
  <v-dialog class="modal" v-model="modal" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!harmful || !formIsValid"
        class="harmful-button"
        x-large
        type="submit"
        v-bind="attrs"
        v-on="on"
        @click="clearTimer"
        >Начать</v-btn
      >
    </template>

    <v-card v-if="!isTimerStarted" class="modal-card">
      <v-card-title>Мой осознанный выбор:</v-card-title>
      <v-card-text class="modal-card-text">
        Потратить {{ time }} мин. на {{ harmful | lowerCase }} вместо
        {{ usefull | lowerCase }}
      </v-card-text>
      <v-btn class="startButton" @click="runTimer">Начать</v-btn>
    </v-card>

    <div class="timer" v-if="isTimerStarted">
      <h2>Буду {{ harmful | lowerCase }} ещё:</h2>
      <flip-countdown
        :deadline="timer"
        :showDays="false"
        @timeElapsed="timeElapsedHandler"
      ></flip-countdown>
      <v-btn @click="clearTimer" class="startButton">Стоп</v-btn>
    </div>
  </v-dialog>
</template>

<script>
import FlipCountdown from "vue2-flip-countdown";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      modal: false,
    };
  },
  components: { FlipCountdown },
  props: {
    harmful: String,
    time: String,
    usefull: String,
    formIsValid: Boolean,
  },
  computed: {
    ...mapGetters({
      getTimerState: "timer/getTimerState",
      getTimerValue: "timer/getTimerValue",
    }),

    isTimerStarted() {
      return this.getTimerState;
    },

    timer() {
      return this.getTimerValue;
    },
  },
  methods: {
    ...mapActions({
      startTimer: "timer/startTimer",
      stopTimer: "timer/stopTimer",
    }),

    runTimer() {
      const timeSplit = this.time.split(":");
      const timeHours = Number(timeSplit[0]);
      const timeMinutes = Number(timeSplit[1]);

      let timeString = "";
      timeString = this.$moment().add(timeMinutes, "minutes").format();

      if (timeHours) {
        timeString = this.$moment(timeString).add(timeHours, "hours").format();
      }
      timeString = timeString.split("T").join();
      this.startTimer(timeString);
    },

    clearTimer() {
      this.stopTimer();
      this.modal = false;
    },

    timeElapsedHandler() {
      const alertSound = new Audio(require("@/assets/alert.mp3"));
      alertSound.play();
    },
  },
  filters: {
    lowerCase(string) {
      return string.toLowerCase();
    },
  },
};
</script>

<style scoped>
.modal {
  background: white;
}
.harmful-button {
  display: block;
  margin: 15px auto;
}

.timer {
  background: white;
  padding: 16px;
}

.startButton {
  display: block;
  margin: 0 auto;
}

.modal-card {
  padding-bottom: 16px;
}

.modal-card-text {
  font-size: 18px;
}
</style>
