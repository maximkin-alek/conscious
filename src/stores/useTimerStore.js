import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTimerStore = defineStore("timer", () => {
  const isTimerStarted = ref(false);
  const deadlineMs = ref(null);

  const getTimerState = computed(() => isTimerStarted.value);
  const getDeadlineMs = computed(() => deadlineMs.value);

  function startTimer(newDeadlineMs) {
    deadlineMs.value = newDeadlineMs;
    isTimerStarted.value = true;
  }

  function stopTimer() {
    deadlineMs.value = null;
    isTimerStarted.value = false;
  }

  return {
    isTimerStarted,
    deadlineMs,
    getTimerState,
    getDeadlineMs,
    startTimer,
    stopTimer,
  };
});
