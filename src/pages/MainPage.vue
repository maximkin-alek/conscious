<template>
  <div>
    <v-container class="body">
      <h2 class="title">О сервисе:</h2>
      <div class="description">
        <p class="description-text">
          Наш сервис поможет вам принимать осознанные решения и выбирать, чем
          заняться сейчас. Добавьте список дел, а затем при желании используйте
          таймер как инструмент фокуса — без упрёков и давления.
        </p>
        <v-img
          class="description-image"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Downward_Dog_Pose_%28Doga%29.jpg/1280px-Downward_Dog_Pose_%28Doga%29.jpg"
          alt="йога"
        />
      </div>

      <section>
        <h2 class="title">Список дел</h2>
        <p class="subtitle">
          Добавьте пару дел, чтобы сервис мог напоминать о вариантах выбора.
        </p>
        <v-form
          v-model="usefulFormValid"
          lazy-validation
          ref="usefulForm"
          class="useful-form"
          @submit.prevent="addUsefulActivity"
        >
          <div class="form-item">
            <v-text-field
              v-model="currentUseful"
              required
              placeholder="Что нужно сделать"
              class="form-input"
              :rules="inputRules"
              :counter="50"
            />
          </div>
          <v-btn class="form-button" type="submit">Добавить</v-btn>
        </v-form>
        <div class="content-block">
          <v-card elevation="4" shaped>
            <v-card-title>Список дел:</v-card-title>
            <v-list>
              <v-list-item
                v-for="(task, i) in tasksList"
                :key="task"
                class="form-list-item"
              >
                <v-list-item-title class="form-text">
                  {{ i + 1 }}. {{ task }}
                </v-list-item-title>
                <template #append>
                  <v-btn
                    @click="deleteListItem(task)"
                    class="form-delete-button"
                    size="small"
                    icon
                    variant="text"
                  >
                    <v-icon color="red">mdi-delete-circle</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list> </v-card
          ><v-img
            class="harmful-image"
            src="https://ferret-pet.ru/wp-content/uploads/7/a/9/7a94f948d1261bd441561f5e72b50385.jpeg"
            alt="Кот учится"
          />
        </div>
        <div class="content-block">
          <v-img
            class="harmful-image"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Snowy_mountain_range.jpg/1280px-Snowy_mountain_range.jpg"
            alt="Вид на горы"
          />
          <v-form
            v-model="harmfulFormValid"
            lazy-validation
            ref="harmfulForm"
            @submit.prevent="addHarmfulHabit"
          >
            <h2 class="title">Чем хотите заняться сейчас:</h2>
            <div class="form-items">
              <div class="form-item">
                <v-text-field
                  :rules="inputRules"
                  :counter="50"
                  required
                  v-model="currentHarmfulHabit"
                  placeholder="Что будете делать"
                  class="form-input"
                />
              </div>

              <div class="time-form-item">
                <label for="time-to-harmful"
                  >Сколько времени собираетесь потратить:
                </label>
                <v-text-field
                  v-model="time"
                  id="time-to-harmful"
                  type="time"
                  step="60"
                  density="compact"
                />
              </div>
            </div>

            <main-popup
              :time="time"
              :harmful="currentHarmfulHabit"
              :usefull="getRandomTask()"
              :formIsValid="harmfulFormValid"
            />
          </v-form>
        </div>

        <div class="content-block">
          <v-card elevation="4" class="chat-card">
            <v-card-title>AI-чат</v-card-title>
            <v-card-text class="chat-scroll">
              <div v-if="messages.length === 0" class="empty">
                Напиши первое сообщение, например: «Привет, расскажи что ты
                умеешь».
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
        </div>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import MainPopup from "../components/MainPopup.vue";
import { useChat } from "../composables/useChat";

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

const { messages, input, isLoading, hasFirstChunk, canSubmit, handleSubmit } =
  useChat({
    api: "/api/chat",
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
.body {
  padding: 40px;
  min-height: 80vh;
  background: #f7f8fb;
}
.description {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}
.description-text {
  font-family: "Ubuntu", sans-serif;
  font-size: 24px;
  margin-right: 0;
  font-style: italic;
}
.description-image {
  width: 40%;
  border-radius: 14px;
}
.form-label {
  display: block;
}
.useful-form {
  display: flex;
  align-items: center;
  padding: 16px;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.form-item {
  width: 50%;
}
.form-text {
  font-family: "Ubuntu", sans-serif;
  font-size: 18px;
  line-height: 32px;
  font-weight: 500;
}
.form-list-item {
  min-height: 32px;
  border-bottom: 1px solid lightgrey;
}
.form-delete-button {
  margin-left: 8px;
}

.form-button {
  margin-left: 15px;
}
.time-form-item {
  display: flex;
  flex-direction: column;
  max-width: 50%;
  margin: 0 auto;
}
.title {
  margin-top: 25px;
}
.subtitle {
  font-family: "Ubuntu", sans-serif;
  font-size: 16px;
  font-weight: 600;
  font-style: italic;
}
.content-block {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 4fr 6fr;
  column-gap: 16px;
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
.harmful-image {
  border-radius: 14px;
}
@media screen and (max-width: 1024px) {
  .body {
    padding: 24px;
  }
  .description {
    display: block;
  }
  .description-image {
    width: 100%;
  }
  .time-form-item {
    max-width: 80%;
  }
}
@media screen and (max-width: 768px) {
  .body {
    padding: 16px;
  }
  .description-text {
    font-size: 16px;
  }
  .description-image {
    width: 100%;
  }
  .useful-form {
    display: block;
  }
  .form-item {
    width: 100%;
  }
  .form-text {
    font-size: 14px;
    line-height: 24px;
  }
  .form-button {
    display: block;
    margin: 0 auto;
  }
  .content-block {
    display: block;
  }
  .content-block:last-of-type {
    display: flex;
    flex-direction: column-reverse;
  }
  .time-form-item {
    max-width: 100%;
  }
}
</style>
