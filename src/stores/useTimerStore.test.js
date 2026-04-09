import { describe, expect, it, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTimerStore } from "./useTimerStore";

describe("useTimerStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("has correct initial state", () => {
    const store = useTimerStore();

    expect(store.isTimerStarted).toBe(false);
    expect(store.deadlineMs).toBe(null);
    expect(store.getTimerState).toBe(false);
    expect(store.getDeadlineMs).toBe(null);
  });

  it("startTimer sets deadlineMs and starts timer", () => {
    const store = useTimerStore();
    const deadline = Date.now() + 60000;

    store.startTimer(deadline);

    expect(store.isTimerStarted).toBe(true);
    expect(store.deadlineMs).toBe(deadline);
    expect(store.getTimerState).toBe(true);
    expect(store.getDeadlineMs).toBe(deadline);
  });

  it("stopTimer clears deadlineMs and stops timer", () => {
    const store = useTimerStore();
    store.startTimer(Date.now() + 60000);

    store.stopTimer();

    expect(store.isTimerStarted).toBe(false);
    expect(store.deadlineMs).toBe(null);
    expect(store.getTimerState).toBe(false);
    expect(store.getDeadlineMs).toBe(null);
  });
});
