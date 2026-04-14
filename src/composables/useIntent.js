import { onMounted, ref } from "vue";

const STORAGE_KEY = "lastHarmfulIntent";

export function useIntent() {
  const currentIntent = ref("");

  function loadIntent() {
    if (typeof window === "undefined") return "";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (typeof saved === "string" && saved.trim()) {
      currentIntent.value = saved;
      return saved;
    }
    return "";
  }

  function saveIntent(intent) {
    const next = typeof intent === "string" ? intent.trim() : "";
    if (!next) return;
    currentIntent.value = next;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  function clearIntent() {
    currentIntent.value = "";
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  onMounted(() => {
    loadIntent();
  });

  return {
    currentIntent,
    loadIntent,
    saveIntent,
    clearIntent,
  };
}
