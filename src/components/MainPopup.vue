<template>
  <v-dialog class="modal" v-model="modal" max-width="560px">
    <template #activator="{ props }">
      <v-btn
        :disabled="!harmful || !formIsValid"
        class="harmful-button"
        size="x-large"
        type="button"
        v-bind="props"
        @click="resetTimer"
      >
        <span class="btn-icon">▶</span>
        Начать
      </v-btn>
    </template>

    <v-card v-if="!isTimerStarted" class="modal-card">
      <div class="modal-header">
        <span class="modal-icon">🌿</span>
        <v-card-title class="modal-title">Мой осознанный выбор</v-card-title>
      </div>
      <v-card-text class="modal-card-text">
        <p class="choice-text">
          Потратить <strong>{{ time }}</strong> мин. на
        </p>
        <p class="activity harmful-activity">{{ harmfulLower }}</p>
        <p class="instead">вместо</p>
        <p class="activity useful-activity">{{ usefullLower }}</p>
      </v-card-text>
      <div class="modal-actions">
        <v-btn class="startButton" @click="runTimer">
          <span class="btn-icon">▶</span>
          Начать
        </v-btn>
      </div>
    </v-card>

    <v-card v-if="isTimerStarted" class="timer-card">
      <div class="timer-header">
        <span class="timer-icon">⏱</span>
        <h2 class="timer-title" v-if="displayedIntentForTitle">
          Буду {{ displayedIntentForTitle }} ещё:
        </h2>
        <h2 class="timer-title" v-else>Таймер:</h2>
      </div>
      <countdown-timer
        v-if="deadlineMs"
        :deadlineMs="deadlineMs"
        @timeElapsed="timeElapsedHandler"
      />
      <div class="timer-actions">
        <v-btn @click="clearTimer" class="stopButton">
          <span class="btn-icon">■</span>
          Стоп
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import CountdownTimer from "./CountdownTimer.vue";
import { useTimerStore } from "../stores/useTimerStore";
import { useIntent } from "../composables/useIntent";
import alertSoundUrl from "../assets/alert.mp3";

const props = defineProps({
  harmful: String,
  time: String,
  usefull: String,
  formIsValid: Boolean,
});

const modal = ref(false);
const beepAudio = ref(null);
const sessionIntent = ref("");
const { currentIntent, saveIntent } = useIntent();

const timerStore = useTimerStore();
const { isTimerStarted, deadlineMs } = storeToRefs(timerStore);
const { startTimerRemote, stopTimerRemote, loadTimer } = timerStore;

const harmfulText = computed(() => (props.harmful || "").trim());
const harmfulLower = computed(() => harmfulText.value.toLowerCase());
const usefullLower = computed(() => (props.usefull || "").toLowerCase());
const sessionIntentText = computed(() => (sessionIntent.value || "").trim());
const currentIntentText = computed(() => (currentIntent.value || "").trim());

// Сохраняем ввод пользователя из формы (не приводим к lower-case, чтобы не портить текст)
watch(
  harmfulText,
  (newValue) => {
    if (newValue) {
      saveIntent(newValue);
    }
  },
  { immediate: true },
);

const looksLikeInfinitive = (s) => /(?:ть|ти|чь)$/i.test(s);

const toInstrumental = (s) => {
  // Очень простая эвристика для “заниматься <кем/чем>”.
  const w = String(s || "").trim();
  if (!w) return "";

  const lower = w.toLowerCase();
  // "йога" -> "йогой", "тренировка" -> "тренировкой"
  if (/[а]$/.test(lower)) return w.slice(0, -1) + "ой";
  // "медитация" -> "медитацией"
  if (/[я]$/.test(lower)) return w.slice(0, -1) + "ей";
  // "вода" -> "водой" (тоже попадает в 'а')
  if (/[ь]$/.test(lower)) return w.slice(0, -1) + "ью";
  if (/[й]$/.test(lower)) return w.slice(0, -1) + "ем";
  if (/[о]$/.test(lower)) return w.slice(0, -1) + "ом";
  if (/[е]$/.test(lower)) return w.slice(0, -1) + "ем";
  // fallback: unchanged
  return w;
};

const formatIntentForTitle = (intent) => {
  const t = String(intent || "").trim();
  if (!t) return "";
  if (looksLikeInfinitive(t)) return t.toLowerCase();
  return `заниматься ${toInstrumental(t).toLowerCase()}`;
};

const displayedIntentForTitle = computed(() => {
  // Приоритет: 1) Значение из сессии (могло прийти из AI-диалога), 2) локальное (форма/localStorage)
  const raw = sessionIntentText.value || currentIntentText.value;
  return formatIntentForTitle(raw);
});

onMounted(() => {
  loadTimer();
  void loadSession();
});

watch(
  () => isTimerStarted.value,
  (started) => {
    if (started) {
      modal.value = true;
      void loadSession();
    }
  },
);

async function loadSession() {
  const res = await fetch("/api/session", { method: "GET" });
  if (!res.ok) return;
  const json = await res.json().catch(() => null);
  const data = json?.data;
  const intent =
    typeof data?.harmfulIntent === "string" ? data.harmfulIntent : "";
  sessionIntent.value = intent;
  // Если intent пришёл из сессии (например, выбран в диалоге с AI) — синхронизируем локально,
  // чтобы заголовок таймера и UI были консистентны.
  if (intent && intent.trim() && intent.trim() !== currentIntent.value) {
    saveIntent(intent.trim());
  }
}

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

    // Manual path should be equivalent to chat path:
    // persist the user's current intent to backend session before starting timer.
    const intent = harmfulText.value;
    if (intent) {
      void fetch("/api/session/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      })
        .then((r) => r.json().catch(() => null))
        .then((json) => {
          const savedIntent =
            typeof json?.data?.harmfulIntent === "string"
              ? json.data.harmfulIntent
              : "";
          if (savedIntent) {
            sessionIntent.value = savedIntent;
            saveIntent(savedIntent);
          }
        })
        .catch(() => {});
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
  background: rgba(42, 42, 42, 0.4);
  backdrop-filter: blur(8px);
}

.harmful-button {
  display: block;
  margin: 24px auto 0;
  background: var(--color-terracotta) !important;
  color: white !important;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  padding: 0 36px !important;
  height: 52px !important;
  border-radius: var(--radius-soft) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.harmful-button:hover:not(:disabled) {
  background: var(--color-terracotta-light) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 112, 75, 0.35);
}

.btn-icon {
  margin-right: 8px;
  font-size: 12px;
}

.modal-card {
  border-radius: var(--radius-medium) !important;
  overflow: hidden;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 0;
  gap: 12px;
}

.modal-icon {
  font-size: 48px;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  color: var(--color-forest);
  text-align: center;
  padding: 0;
  margin: 0;
}

.modal-card-text {
  padding: 28px 32px !important;
  text-align: center;
}

.choice-text {
  font-size: 16px;
  color: var(--color-stone);
  margin: 0 0 8px 0;
}

.choice-text strong {
  color: var(--color-charcoal);
  font-weight: 600;
}

.activity {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  margin: 4px 0;
}

.harmful-activity {
  color: var(--color-terracotta);
}

.instead {
  font-size: 13px;
  color: var(--color-stone);
  margin: 12px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.useful-activity {
  color: var(--color-forest);
}

.modal-actions {
  padding: 0 32px 32px;
}

.startButton {
  width: 100%;
  background: var(--color-forest) !important;
  color: var(--color-sand-light) !important;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  height: 52px !important;
  border-radius: var(--radius-soft) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.startButton:hover {
  background: var(--color-forest-light) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 74, 62, 0.3);
}

.timer-card {
  border-radius: var(--radius-medium) !important;
  padding: 32px;
  text-align: center;
  align-items: center;
}

.timer-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.timer-icon {
  font-size: 48px;
}

.timer-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--color-forest);
  margin: 0;
}

.timer-actions {
  margin-top: 24px;
}

.stopButton {
  background: var(--color-sand) !important;
  color: var(--color-charcoal) !important;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 15px;
  height: 44px !important;
  border-radius: var(--radius-soft) !important;
  transition: all 0.3s ease;
}

.stopButton:hover {
  background: var(--color-sand-dark) !important;
}
</style>
