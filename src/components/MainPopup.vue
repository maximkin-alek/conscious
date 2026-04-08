<template>
  <v-dialog class="modal" v-model="modal" max-width="600px">
    <template #activator="{ props }">
      <v-btn
        :disabled="!harmful || !formIsValid"
        class="harmful-button"
        size="x-large"
        type="button"
        v-bind="props"
        @click="resetTimer"
        >Начать</v-btn
      >
    </template>

    <v-card v-if="!isTimerStarted" class="modal-card">
      <v-card-title>Мой осознанный выбор:</v-card-title>
      <v-card-text class="modal-card-text">
        Потратить {{ time }} мин. на {{ harmfulLower }} вместо
        {{ usefullLower }}
      </v-card-text>
      <v-btn class="startButton" @click="runTimer">Начать</v-btn>
    </v-card>

    <div class="timer" v-if="isTimerStarted">
      <h2>Буду {{ harmfulLower }} ещё:</h2>
      <countdown-timer
        v-if="deadlineMs"
        :deadlineMs="deadlineMs"
        @timeElapsed="timeElapsedHandler"
      />
      <v-btn @click="clearTimer" class="startButton">Стоп</v-btn>
    </div>
  </v-dialog>
</template>

<script>
import dayjs from "dayjs";
import CountdownTimer from "./CountdownTimer.vue";
import { storeToRefs } from "pinia";
import { useTimerStore } from "../stores/useTimerStore";
import alertSoundUrl from "../assets/alert.mp3";

export default {
  data() {
    return {
      modal: false,
      beepAudio: null,
    };
  },
  components: { CountdownTimer },
  setup() {
    const timerStore = useTimerStore();
    const { isTimerStarted, deadlineMs } = storeToRefs(timerStore);
    const { startTimer, stopTimer } = timerStore;

    return {
      isTimerStarted,
      deadlineMs,
      startTimer,
      stopTimer,
    };
  },
  props: {
    harmful: String,
    time: String,
    usefull: String,
    formIsValid: Boolean,
  },
  computed: {
    harmfulLower() {
      return (this.harmful || "").toLowerCase();
    },

    usefullLower() {
      return (this.usefull || "").toLowerCase();
    },
  },
  methods: {
    ensureBeepReady() {
      if (this.beepAudio) return;

      try {
        const audio = new Audio(alertSoundUrl);
        audio.volume = 0.8;
        this.beepAudio = audio;

        // Добавляем обработчик ошибок загрузки
        audio.addEventListener("error", (error) => {
          console.error("Ошибка загрузки аудио:", error);
          this.beepAudio = null;
        });
      } catch (error) {
        console.error("Ошибка создания аудио объекта:", error);
        this.beepAudio = null;
      }
    },

    runTimer() {
      // Готовим аудио в момент user gesture
      this.ensureBeepReady();

      try {
        // Проверяем формат времени HH:mm
        const timeRegex = /^(\d{1,2}):(\d{2})$/;
        const match = this.time.match(timeRegex);

        if (!match) {
          console.error("Неверный формат времени. Используйте HH:mm");
          return;
        }

        const timeHours = parseInt(match[1], 10);
        const timeMinutes = parseInt(match[2], 10);

        // Проверяем валидность значений
        if (
          isNaN(timeHours) ||
          isNaN(timeMinutes) ||
          timeHours < 0 ||
          timeMinutes < 0 ||
          timeMinutes >= 60
        ) {
          console.error("Неверные значения времени. Часы: 0-23, минуты: 0-59");
          return;
        }

        const deadlineMs = dayjs()
          .add(timeMinutes, "minute")
          .add(timeHours, "hour")
          .valueOf();

        this.startTimer(deadlineMs);
      } catch (error) {
        console.error("Ошибка при запуске таймера:", error);
      }
    },

    resetTimer() {
      this.stopTimer();
    },

    clearTimer() {
      this.stopTimer();
      this.modal = false;
    },

    timeElapsedHandler() {
      this.ensureBeepReady();
      if (!this.beepAudio) {
        console.warn("Аудио не загружено");
        return;
      }

      // Повторный play иногда требует сброса currentTime
      this.beepAudio.currentTime = 0;
      this.beepAudio.play().catch((error) => {
        console.warn("Не удалось воспроизвести звук:", error.message);
        // Показываем уведомление пользователю
        if (typeof window !== "undefined" && window.alert) {
          window.alert("Таймер завершен!");
        }
      });
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
