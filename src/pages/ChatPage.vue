<template>
  <v-container class="body">
    <h2 class="title">AI-чат (streaming)</h2>
    <p class="subtitle">Сообщения стримятся в реальном времени с бэкенда.</p>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ error }}
    </v-alert>

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
import { computed } from "vue";
import { useChat } from "../composables/useChat";

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
});

const visibleMessages = computed(() =>
  messages.value.filter((m) => m?.role !== "system"),
);
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
