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

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import CountdownTimer from "./CountdownTimer.vue";
import { useTimerStore } from "../stores/useTimerStore";
import alertSoundUrl from "../assets/alert.mp3";

const props = defineProps({
  harmful: String,
  time: String,
  usefull: String,
  formIsValid: Boolean,
});

const modal = ref(false);
const beepAudio = ref(null);

const timerStore = useTimerStore();
const { isTimerStarted, deadlineMs } = storeToRefs(timerStore);
const { startTimerRemote, stopTimerRemote, loadTimer } = timerStore;

const harmfulLower = computed(() => (props.harmful || "").toLowerCase());
const usefullLower = computed(() => (props.usefull || "").toLowerCase());

onMounted(() => {
  loadTimer();
});

watch(
  () => isTimerStarted.value,
  (started) => {
    if (started) {
      modal.value = true;
    }
  },
);

function ensureBeepReady() {
  if (beepAudio.value) return;

  try {
    const audio = new Audio(alertSoundUrl);
    audio.volume = 0.8;
    beepAudio.value = audio;

    audio.addEventListener("error", (error) => {
      console.error("Ошибка загрузки аудио:", error);
      beepAudio.value = null;
    });
  } catch (error) {
    console.error("Ошибка создания аудио объекта:", error);
    beepAudio.value = null;
  }
}

function runTimer() {
  ensureBeepReady();

  try {
    const timeRegex = /^(\d{1,2}):(\d{2})$/;
    const match = (props.time || "").match(timeRegex);

    if (!match) {
      console.error("Неверный формат времени. Используйте HH:mm");
      return;
    }

    const timeHours = parseInt(match[1], 10);
    const timeMinutes = parseInt(match[2], 10);

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

    const totalMinutes = timeMinutes + timeHours * 60;
    if (totalMinutes <= 0) {
      console.error("Длительность должна быть больше 0 минут");
      return;
    }

    void startTimerRemote(totalMinutes);
  } catch (error) {
    console.error("Ошибка при запуске таймера:", error);
  }
}

function resetTimer() {
  void stopTimerRemote();
}

function clearTimer() {
  void stopTimerRemote();
  modal.value = false;
}

function timeElapsedHandler() {
  ensureBeepReady();
  if (!beepAudio.value) {
    console.warn("Аудио не загружено");
    return;
  }

  beepAudio.value.currentTime = 0;
  beepAudio.value.play().catch((error) => {
    console.warn("Не удалось воспроизвести звук:", error.message);
    if (typeof window !== "undefined" && window.alert) {
      window.alert("Таймер завершен!");
    }
  });
}
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
