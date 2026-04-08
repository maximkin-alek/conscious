<template>
  <div class="countdown">
    <span>{{ formatted }}</span>
  </div>
</template>

<script>
export default {
  name: "CountdownTimer",
  props: {
    deadlineMs: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      nowMs: Date.now(),
      intervalId: null,
      hasElapsed: false,
    };
  },
  computed: {
    remainingMs() {
      return Math.max(0, this.deadlineMs - this.nowMs);
    },
    formatted() {
      const totalSeconds = Math.ceil(this.remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");
      return `${mm}:${ss}`;
    },
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.nowMs = Date.now();
      if (!this.hasElapsed && this.remainingMs === 0) {
        this.hasElapsed = true;
        this.$emit("timeElapsed");
      }
    }, 250);
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.countdown {
  font-size: 44px;
  font-weight: 700;
  text-align: center;
  padding: 8px 0;
}
</style>
