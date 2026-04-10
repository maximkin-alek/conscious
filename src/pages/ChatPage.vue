<template>
  <v-container class="body">
    <h2 class="title">AI-чат (streaming)</h2>
    <p class="subtitle">Сообщения стримятся в реальном времени с бэкенда.</p>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ error }}
    </v-alert>

    <v-card
      v-if="isTimerStarted && deadlineMs"
      elevation="4"
      class="mb-4 timer-card"
    >
      <v-card-title>Таймер</v-card-title>
      <v-card-text>
        <countdown-timer :deadlineMs="deadlineMs" @timeElapsed="loadTimer" />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="error" @click="stopTimerRemote">
          Стоп
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card elevation="4" class="mb-4 actions-card">
      <v-card-title class="actions-title">
        <span>Что сделала модель</span>
        <v-spacer />
        <v-btn
          size="small"
          variant="text"
          :disabled="actionsLoading"
          @click="clearActions"
        >
          Очистить
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="actionsLoading" class="actions-loading">
          <v-progress-circular indeterminate size="18" width="2" />
          <span>Загружаю…</span>
        </div>
        <div v-else-if="actions.length === 0" class="actions-empty">
          Пока нет действий. Отправь сообщение в чат — и тут появятся
          tool-вызовы.
        </div>
        <v-list v-else density="compact">
          <v-list-item v-for="a in actions" :key="a.id">
            <v-list-item-title>
              <strong>{{ a.tool }}</strong>
              <span v-if="a.ok === false" class="bad"> (ошибка)</span>
            </v-list-item-title>
            <v-list-item-subtitle class="mono">
              {{ formatAction(a) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card elevation="4" class="chat-card">
      <v-card-title>Диалог</v-card-title>
      <v-card-text class="chat-scroll">
        <div v-if="messages.length === 0" class="empty">
          Напиши первое сообщение, например: «Скажи привет и посчитай до 5».
        </div>

        <div
          v-for="(m, idx) in visibleMessages"
          :key="idx"
          class="msg"
          :class="m.role"
        >
          <div class="meta">
            <strong>{{ m.role === "user" ? "Вы" : "AI" }}</strong>
          </div>
          <div class="content">{{ m.content }}</div>
        </div>

        <div v-if="isLoading && !hasFirstChunk" class="typing">
          <v-progress-circular indeterminate size="18" width="2" />
          <span>AI думает…</span>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <form class="chat-form" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="input"
            placeholder="Ваше сообщение…"
            :disabled="isLoading"
            hide-details
            density="comfortable"
            @keydown.enter.prevent="handleSubmit"
          />
          <v-btn
            type="submit"
            color="primary"
            :loading="isLoading"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            Отправить
          </v-btn>
        </form>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useChat } from "../composables/useChat";
import { useTimerStore } from "../stores/useTimerStore";
import CountdownTimer from "../components/CountdownTimer.vue";

const timerStore = useTimerStore();
const { isTimerStarted, deadlineMs } = storeToRefs(timerStore);
const { loadTimer, stopTimerRemote } = timerStore;

const state = ref({ items: [], loading: false });
const actions = computed(() => state.value.items);
const actionsLoading = computed(() => state.value.loading);

async function loadActions() {
  state.value.loading = true;
  try {
    const res = await fetch("/api/actions", { method: "GET" });
    const json = await res.json().catch(() => null);
    if (res.ok && Array.isArray(json?.data)) {
      state.value.items = json.data;
    }
  } finally {
    state.value.loading = false;
  }
}

async function clearActions() {
  state.value.loading = true;
  try {
    await fetch("/api/actions/clear", { method: "POST" });
    await loadActions();
  } finally {
    state.value.loading = false;
  }
}

function formatAction(a) {
  const input =
    a?.input && typeof a.input === "object" ? JSON.stringify(a.input) : "";
  const output =
    a?.output && typeof a.output === "object" ? JSON.stringify(a.output) : "";
  return [input && `in: ${input}`, output && `out: ${output}`]
    .filter(Boolean)
    .join(" | ");
}

const {
  messages,
  input,
  isLoading,
  hasFirstChunk,
  error,
  canSubmit,
  handleSubmit,
} = useChat({
  api: "/api/chat",
  onFinish: async () => {
    await loadTimer();
    await loadActions();
  },
});

const visibleMessages = computed(() =>
  messages.value.filter((m) => m?.role !== "system"),
);

onMounted(() => {
  loadTimer();
  loadActions();
});
</script>

<style scoped>
.body {
  padding: 40px;
  min-height: 80vh;
  background: #f7f8fb;
}
.title {
  margin-bottom: 8px;
}
.subtitle {
  margin-bottom: 16px;
  opacity: 0.8;
}
.chat-card {
  border-radius: 12px;
}
.timer-card {
  border-radius: 12px;
}
.actions-card {
  border-radius: 12px;
}
.actions-title {
  display: flex;
  align-items: center;
}
.actions-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.75;
}
.actions-empty {
  opacity: 0.75;
}
.mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-word;
}
.bad {
  color: #b00020;
}
.chat-scroll {
  max-height: 55vh;
  overflow: auto;
}
.chat-form {
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: center;
}
.empty {
  opacity: 0.75;
}
.msg {
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: white;
}
.msg.user {
  background: #eef2ff;
}
.msg.assistant {
  background: #ffffff;
}
.meta {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}
.content {
  white-space: pre-wrap;
}
.typing {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  opacity: 0.75;
  font-size: 14px;
}
</style>
