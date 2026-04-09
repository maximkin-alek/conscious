import { describe, expect, it, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTimerStore } from "./useTimerStore";

describe("useTimerStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("stopTimer is idempotent (stop without start)", () => {
    const store = useTimerStore();

    store.stopTimer();

    expect(store.isTimerStarted).toBe(false);
    expect(store.deadlineMs).toBe(null);
  });

  it("startTimer accepts a deadline in the past", () => {
    const store = useTimerStore();
    const pastDeadline = Date.now() - 1000;

    store.startTimer(pastDeadline);

    expect(store.isTimerStarted).toBe(true);
    expect(store.deadlineMs).toBe(pastDeadline);
  });

  it("startTimer accepts a negative deadline", () => {
    const store = useTimerStore();
    const negativeDeadline = -1;

    store.startTimer(negativeDeadline);

    expect(store.isTimerStarted).toBe(true);
    expect(store.deadlineMs).toBe(negativeDeadline);
  });

  it("startTimer overwrites previous deadline when called twice", () => {
    const store = useTimerStore();
    const first = Date.now() + 60000;
    const second = Date.now() + 120000;

    store.startTimer(first);
    store.startTimer(second);

    expect(store.isTimerStarted).toBe(true);
    expect(store.deadlineMs).toBe(second);
  });

  it("stopTimer clears started state even after multiple starts", () => {
    const store = useTimerStore();
    store.startTimer(Date.now() + 60000);
    store.startTimer(Date.now() + 120000);

    store.stopTimer();

    expect(store.isTimerStarted).toBe(false);
    expect(store.deadlineMs).toBe(null);
  });
});
