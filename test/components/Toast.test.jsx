import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import Toast from "../../src/components/Toast";

describe("Toast Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test("renders toast component correctly with message and type", () => {
    act(() => {
      render(<Toast message="Test message" type="success" />);
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("Test message").classList).toContain("toast");
    expect(screen.getByText("Test message").classList).toContain("success");
  });

  test("toast component disappears after 3 seconds", async () => {
    act(() => {
      render(<Toast message="Test message" type="success" />);
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });
  });

  test("toast component updates correctly when message changes", () => {
    let rerender;
    act(() => {
      ({ rerender } = render(
        <Toast message="Initial message" type="success" />
      ));
    });

    expect(screen.getByText("Initial message")).toBeInTheDocument();

    act(() => {
      rerender(<Toast message="Updated message" type="error" />);
    });

    expect(screen.queryByText("Initial message")).not.toBeInTheDocument();
    expect(screen.getByText("Updated message")).toBeInTheDocument();
    expect(screen.getByText("Updated message").classList).toContain("toast");
    expect(screen.getByText("Updated message").classList).toContain("error");
  });
});
