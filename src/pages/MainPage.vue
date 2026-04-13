<template>
  <div class="page-wrapper">
    <v-container class="main-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <p class="hero-eyebrow">Сервис осознанного выбора</p>
          <h1 class="hero-title">Каждое решение — это шаг к себе</h1>
          <p class="hero-description">
            Добавьте список дел, а затем при желании используйте таймер как
            инструмент фокуса — без упрёков и давления.
          </p>
        </div>
        <div class="hero-image-wrapper">
          <v-img
            class="hero-image"
            src="https://i.ytimg.com/vi/wSO4ixCnnM8/maxresdefault.jpg"
            alt="Осознанность и гармония"
            cover
          />
          <div class="hero-image-overlay"></div>
        </div>
      </section>

      <!-- Tasks Section -->
      <section class="section tasks-section">
        <div class="section-header">
          <span class="section-icon">📝</span>
          <h2 class="section-title">Список дел</h2>
        </div>
        <p class="section-subtitle">
          Добавьте задачи, которые хотите сделать — сервис поможет напомнить о
          них в нужный момент.
        </p>

        <v-form
          v-model="usefulFormValid"
          lazy-validation
          ref="usefulForm"
          class="add-task-form"
          @submit.prevent="addUsefulActivity"
        >
          <v-text-field
            v-model="currentUseful"
            required
            placeholder="Что нужно сделать..."
            class="task-input"
            :rules="inputRules"
            :counter="50"
            variant="outlined"
            density="comfortable"
            hide-details
          />
          <v-btn
            class="add-button"
            type="submit"
            size="large"
            :disabled="!usefulFormValid"
          >
            <span class="button-icon">+</span>
            Добавить
          </v-btn>
        </v-form>

        <div class="tasks-layout">
          <v-card class="tasks-card" elevation="0">
            <div class="tasks-card-header">
              <span class="card-title">Ваши задачи</span>
              <span class="tasks-count" v-if="tasksList.length">{{
                tasksList.length
              }}</span>
            </div>
            <v-list class="tasks-list" v-if="tasksList.length">
              <v-list-item
                v-for="(task, i) in tasksList"
                :key="task"
                class="task-item"
              >
                <template #prepend>
                  <span class="task-number">{{ i + 1 }}</span>
                </template>
                <v-list-item-title class="task-text">{{
                  task
                }}</v-list-item-title>
                <template #append>
                  <v-btn
                    @click="deleteListItem(task)"
                    class="delete-btn"
                    size="small"
                    icon
                    variant="text"
                  >
                    <v-icon size="20">mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="empty-tasks">
              <span class="empty-icon">🌱</span>
              <p>Список пуст. Добавьте первую задачу выше.</p>
            </div>
          </v-card>

          <div class="image-aside">
            <img
              src="https://ferret-pet.ru/wp-content/uploads/7/a/9/7a94f948d1261bd441561f5e72b50385.jpeg"
              alt="Кот учится"
              class="aside-image"
            />
          </div>
        </div>
      </section>

      <!-- Choice Section -->
      <section class="section choice-section">
        <div class="choice-layout">
          <div class="image-aside left">
            <img
              src="https://img.freepik.com/free-photo/view-mountain-with-dreamy-aesthetic_23-2151700198.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Горы"
              class="aside-image"
            />
          </div>

          <v-form
            v-model="harmfulFormValid"
            lazy-validation
            ref="harmfulForm"
            class="choice-form"
            @submit.prevent="addHarmfulHabit"
          >
            <div class="section-header">
              <span class="section-icon">🎯</span>
              <h2 class="section-title">Чем хотите заняться сейчас?</h2>
            </div>

            <v-text-field
              :rules="inputRules"
              :counter="50"
              required
              v-model="currentHarmfulHabit"
              placeholder="Что будете делать..."
              class="choice-input"
              variant="outlined"
              density="comfortable"
              hide-details
            />

            <div class="time-selector">
              <label class="time-label">Сколько времени:</label>
              <v-text-field
                v-model="time"
                type="time"
                step="60"
                variant="outlined"
                density="compact"
                class="time-input"
                hide-details
              />
            </div>

            <main-popup
              :time="time"
              :harmful="currentHarmfulHabit"
              :usefull="getRandomTask()"
              :formIsValid="harmfulFormValid"
            />
          </v-form>
        </div>
      </section>

      <!-- Chat Section -->
      <section class="section chat-section">
        <div class="section-header centered">
          <span class="section-icon">💬</span>
          <h2 class="section-title">AI-чат</h2>
        </div>

        <v-card class="chat-card" elevation="0">
          <v-card-text class="chat-messages">
            <div v-if="messages.length === 0" class="chat-empty">
              <span class="chat-empty-icon">✨</span>
              <p>
                Напишите первое сообщение, например: «Привет, расскажи что ты
                умеешь».
              </p>
            </div>

            <div
              v-for="(m, idx) in visibleMessages"
              :key="idx"
              class="message"
              :class="m.role"
            >
              <div class="message-avatar">
                {{ m.role === "user" ? "Вы" : "AI" }}
              </div>
              <div class="message-bubble">
                <div class="message-content">{{ m.content }}</div>
              </div>
            </div>

            <div v-if="isLoading && !hasFirstChunk" class="typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </v-card-text>

          <div class="chat-input-area">
            <v-text-field
              v-model="input"
              placeholder="Напишите сообщение..."
              :disabled="isLoading"
              variant="outlined"
              density="comfortable"
              hide-details
              class="chat-input"
              @keydown.enter.prevent="handleSubmit"
            />
            <v-btn
              type="submit"
              class="send-button"
              :loading="isLoading"
              :disabled="!canSubmit"
              @click="handleSubmit"
              size="large"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </div>
        </v-card>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import MainPopup from "../components/MainPopup.vue";
import { useChat } from "../composables/useChat";
import { useTimerStore } from "../stores/useTimerStore";

const store = useStore();

const usefulForm = ref(null);
const harmfulForm = ref(null);

const currentUseful = ref("");
const currentHarmfulHabit = ref("");
const time = ref("00:15");

const usefulFormValid = ref(false);
const harmfulFormValid = ref(false);

const inputRules = [
  (v) => Boolean(v) || "Необходимо заполнить поле",
  (v) => (Boolean(v) && v.length <= 50) || "Не больше 50 знаков ",
];

const tasksList = computed(() => store.getters["tasks/getTasksList"]);

onMounted(() => {
  store.dispatch("tasks/loadTasks");
});

const timerStore = useTimerStore();

const { messages, input, isLoading, hasFirstChunk, canSubmit, handleSubmit } =
  useChat({
    api: "/api/chat",
    onFinish: timerStore.loadTimer,
  });

const visibleMessages = computed(() =>
  messages.value.filter((m) => m?.role !== "system"),
);

function addUseful(payload) {
  return store.dispatch("tasks/addTask", payload);
}

function deleteUseful(payload) {
  return store.dispatch("tasks/deleteTask", payload);
}

function getRandomArrayElement(arr) {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

async function addUsefulActivity() {
  const result = await usefulForm.value?.validate?.();
  if (result?.valid) {
    await addUseful(currentUseful.value);
    usefulForm.value?.reset?.();
  }
}

function addHarmfulHabit() {}

function deleteListItem(itemName) {
  deleteUseful(itemName);
}

function getRandomTask() {
  return getRandomArrayElement(tasksList.value);
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-sand-light);
}

.main-container {
  max-width: 1100px;
  padding: 48px 24px;
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 64px;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-content {
  padding-right: 24px;
}

.hero-eyebrow {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-terracotta);
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  line-height: 1.15;
  color: var(--color-forest);
  margin: 0 0 24px 0;
}

.hero-description {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-stone);
  margin: 0;
}

.hero-image-wrapper {
  position: relative;
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.hero-image {
  width: 100%;
  height: 360px;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-image-wrapper:hover .hero-image {
  transform: scale(1.03);
}

.hero-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(45, 74, 62, 0.15), transparent 60%);
  pointer-events: none;
}

/* Section Styles */
.section {
  margin-bottom: 64px;
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: backwards;
}

.tasks-section {
  animation-delay: 0.1s;
}

.choice-section {
  animation-delay: 0.2s;
}

.chat-section {
  animation-delay: 0.3s;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.section-header.centered {
  justify-content: center;
}

.section-icon {
  font-size: 28px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 500;
  color: var(--color-forest);
  margin: 0;
}

.section-subtitle {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-stone);
  margin: 0 0 28px 0;
  max-width: 600px;
}

/* Add Task Form */
.add-task-form {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 32px;
  background: white;
  padding: 20px 24px;
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-soft);
}

.task-input {
  flex: 1;
}

.add-button {
  background: var(--color-forest) !important;
  color: var(--color-sand-light) !important;
  font-family: var(--font-body);
  font-weight: 500;
  padding: 0 28px !important;
  height: 56px !important;
  border-radius: var(--radius-soft) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-button:hover {
  background: var(--color-forest-light) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 74, 62, 0.25);
}

.button-icon {
  font-size: 20px;
  margin-right: 8px;
}

/* Tasks Layout */
.tasks-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}

.tasks-card {
  background: white !important;
  border-radius: var(--radius-medium) !important;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.tasks-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-sand);
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-forest);
}

.tasks-count {
  background: var(--color-terracotta);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.tasks-list {
  padding: 8px 0;
}

.task-item {
  padding: 14px 24px !important;
  transition: background 0.2s ease;
}

.task-item:hover {
  background: var(--color-sand-light);
}

.task-number {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-terracotta);
  margin-right: 12px;
  min-width: 24px;
}

.task-text {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-charcoal);
}

.delete-btn {
  opacity: 0.4;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  transform: scale(1.1);
}

.empty-tasks {
  padding: 48px 24px;
  text-align: center;
  color: var(--color-stone);
}

.empty-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-tasks p {
  margin: 0;
  font-size: 14px;
}

/* Aside Image */
.image-aside {
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-aside:hover {
  transform: translateY(-4px);
}

.image-aside.left {
  order: -1;
}

.aside-image {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  display: block;
}

/* Choice Section */
.choice-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  align-items: start;
}

.choice-form {
  background: white;
  padding: 32px;
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-soft);
}

.choice-input {
  margin-bottom: 20px;
}

.time-selector {
  margin-bottom: 28px;
}

.time-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-stone);
  margin-bottom: 8px;
}

.time-input {
  max-width: 160px;
}

/* Chat Section */
.chat-card {
  background: white !important;
  border-radius: var(--radius-medium) !important;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.chat-messages {
  max-height: 55vh;
  min-height: 300px;
  overflow-y: auto;
  padding: 24px !important;
}

.chat-empty {
  text-align: center;
  padding: 60px 24px;
  color: var(--color-stone);
}

.chat-empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.chat-empty p {
  margin: 0;
  font-size: 15px;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
}

.message {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
  animation: messageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--color-terracotta);
  color: white;
}

.message.assistant .message-avatar {
  background: var(--color-forest);
  color: white;
}

.message-bubble {
  max-width: 75%;
  padding: 16px 20px;
  border-radius: 18px;
  background: var(--color-sand-light);
}

.message.user .message-bubble {
  background: var(--color-forest);
  color: white;
  border-bottom-right-radius: 6px;
}

.message.assistant .message-bubble {
  border-bottom-left-radius: 6px;
}

.message-content {
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 16px 20px;
  justify-content: flex-start;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--color-stone);
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-input-area {
  display: flex;
  gap: 14px;
  padding: 20px 24px;
  background: var(--color-sand-light);
  align-items: center;
}

.chat-input {
  flex: 1;
}

.send-button {
  background: var(--color-terracotta) !important;
  color: white !important;
  width: 52px;
  height: 52px !important;
  border-radius: 50% !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-button:hover:not(:disabled) {
  background: var(--color-terracotta-light) !important;
  transform: scale(1.05);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typingBounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-content {
    padding-right: 0;
    text-align: center;
  }

  .hero-title {
    font-size: 38px;
  }

  .tasks-layout {
    grid-template-columns: 1fr;
  }

  .image-aside {
    display: none;
  }

  .choice-layout {
    grid-template-columns: 1fr;
  }

  .choice-layout .image-aside {
    display: block;
    order: -1;
  }

  .choice-layout .image-aside .aside-image {
    min-height: 200px;
    max-height: 240px;
  }
}

@media screen and (max-width: 768px) {
  .main-container {
    padding: 32px 16px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-description {
    font-size: 15px;
  }

  .hero-image {
    height: 240px;
  }

  .section-title {
    font-size: 26px;
  }

  .add-task-form {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .add-button {
    width: 100%;
  }

  .choice-form {
    padding: 24px 20px;
  }

  .chat-input-area {
    flex-direction: column;
    gap: 12px;
  }

  .send-button {
    width: 100% !important;
    height: 48px !important;
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
