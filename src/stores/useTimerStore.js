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

  async function loadTimer() {
    const res = await fetch("/api/timer", { method: "GET" });
    if (!res.ok) return;
    const json = await res.json().catch(() => null);
    const data = json?.data;
    if (!data || typeof data !== "object") return;

    const started = Boolean(data.isStarted);
    const dl = typeof data.deadlineMs === "number" ? data.deadlineMs : null;
    if (started && dl) {
      startTimer(dl);
    } else {
      stopTimer();
    }
  }

  async function startTimerRemote(minutes) {
    const res = await fetch("/api/timer/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes }),
    });
    const json = await res.json().catch(() => null);
    const data = json?.data;
    if (!res.ok || !data) return;
    if (typeof data.deadlineMs === "number") {
      startTimer(data.deadlineMs);
    }
  }

  async function stopTimerRemote() {
    const res = await fetch("/api/timer/stop", { method: "POST" });
    if (res.ok) stopTimer();
  }

  return {
    isTimerStarted,
    deadlineMs,
    getTimerState,
    getDeadlineMs,
    startTimer,
    stopTimer,
    loadTimer,
    startTimerRemote,
    stopTimerRemote,
  };
});
