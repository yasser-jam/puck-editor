import { act } from "@testing-library/react";
import { createAppStore } from "..";

describe("createAppStore", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("cleans up pending component loading timers", () => {
    const appStore = createAppStore();

    expect(Object.keys(appStore.getState().pendingLoadTimeouts)).toHaveLength(
      0
    );

    act(() => {
      appStore.getState().setComponentLoading("component-1", true, 25);
    });

    expect(Object.keys(appStore.getState().pendingLoadTimeouts)).toHaveLength(
      1
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(appStore.getState().componentState["component-1"]?.loadingCount).toBe(
      1
    );
    expect(Object.keys(appStore.getState().pendingLoadTimeouts)).toHaveLength(
      0
    );
  });
});