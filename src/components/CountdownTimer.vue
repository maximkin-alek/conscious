<template>
  <div class="countdown-wrapper">
    <div class="countdown">
      <span class="time-value">{{ formatted }}</span>
    </div>
    <div class="countdown-progress">
      <div class="progress-ring">
        <svg viewBox="0 0 120 120">
          <circle
            class="progress-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke-width="8"
          />
          <circle
            class="progress-bar"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke-width="8"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  deadlineMs: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["timeElapsed"]);

const nowMs = ref(Date.now());
const intervalId = ref(null);
const hasElapsed = ref(false);
const totalDuration = ref(props.deadlineMs - Date.now());

const remainingMs = computed(() => Math.max(0, props.deadlineMs - nowMs.value));

const formatted = computed(() => {
  const totalSeconds = Math.ceil(remainingMs.value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
});

const circumference = 2 * Math.PI * 54;

const progressOffset = computed(() => {
  const elapsed = props.deadlineMs - remainingMs.value;
  const progress = elapsed / totalDuration.value;
  return circumference * (1 - Math.min(1, Math.max(0, progress)));
});

onMounted(() => {
  totalDuration.value = props.deadlineMs - Date.now();
  intervalId.value = setInterval(() => {
    nowMs.value = Date.now();
    if (!hasElapsed.value && remainingMs.value === 0) {
      hasElapsed.value = true;
      emit("timeElapsed");
    }
  }, 250);
});

onBeforeUnmount(() => {
  if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<style scoped>
.countdown-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
}

.countdown {
  position: relative;
  z-index: 1;
}

.time-value {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  color: var(--color-forest);
  letter-spacing: 1px;
}

.countdown-progress {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.progress-ring {
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);
}

.progress-ring svg {
  width: 100%;
  height: 100%;
}

.progress-bg {
  stroke: var(--color-sand);
}

.progress-bar {
  stroke: var(--color-terracotta);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}
</style>
