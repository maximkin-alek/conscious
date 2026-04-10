import { computed, nextTick, reactive, ref } from "vue";

const asText = (value) => (typeof value === "string" ? value : "");

export function useChat(options = {}) {
  const api = asText(options.api) || "http://localhost:3001/api/chat";

  const input = ref("");
  const isLoading = ref(false);
  const hasFirstChunk = ref(false);
  const error = ref("");
  const messages = ref([]);

  const canSubmit = computed(
    () => !isLoading.value && input.value.trim().length > 0,
  );

  async function sendMessage(content) {
    const text = asText(content).trim();
    if (!text) return;

    error.value = "";
    isLoading.value = true;
    hasFirstChunk.value = false;

    const nextMessages = [...messages.value, { role: "user", content: text }];
    messages.value = nextMessages;
    input.value = "";

    // placeholder assistant message we will stream into (must be reactive for incremental UI updates)
    const assistant = reactive({ role: "assistant", content: "" });
    messages.value = [...messages.value, assistant];

    const ac = new AbortController();

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: ac.signal,
      });

      if (!res.ok) {
        const textBody = await res.text().catch(() => "");
        error.value = textBody || `HTTP ${res.status}`;
        messages.value = messages.value.slice(0, -1);
        return;
      }

      if (!res.body) {
        error.value = "Ответ без body (stream не поддерживается)";
        messages.value = messages.value.slice(0, -1);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        if (!hasFirstChunk.value) hasFirstChunk.value = true;
        assistant.content = assistant.content + chunk;
        // Yield so the browser/Vue can paint between chunks (especially in Chromium-based browsers).
        await nextTick();
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Неизвестная ошибка";
      messages.value = messages.value.slice(0, -1);
    } finally {
      isLoading.value = false;
    }
  }

  function handleSubmit(event) {
    event?.preventDefault?.();
    void sendMessage(input.value);
  }

  return {
    messages,
    input,
    isLoading,
    hasFirstChunk,
    error,
    canSubmit,
    sendMessage,
    handleSubmit,
  };
}
