<template>
  <div class="countdown">
    <span>{{ formatted }}</span>
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

const remainingMs = computed(() => Math.max(0, props.deadlineMs - nowMs.value));

const formatted = computed(() => {
  const totalSeconds = Math.ceil(remainingMs.value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
});

onMounted(() => {
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
.countdown {
  font-size: 44px;
  font-weight: 700;
  text-align: center;
  padding: 8px 0;
}
</style>
