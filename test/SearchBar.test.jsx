import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, beforeEach, test, vi } from "vitest";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk"; // Correct import for thunk
import SearchBar from "../src/components/SearchBar"; // Adjust the path as necessary
import { setSearchTerm as setSearchTermAction } from "../src/redux/actions/productActions"; // Adjust the path as necessary

const mockStore = configureStore([thunk]);

describe("SearchBar Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: {
        searchTerm: "",
        // Add other parts of your state if necessary
      },
    });

    store.dispatch = vi.fn();
  });

  test("renders SearchBar and interacts with it", () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Search products...");
    const button = screen.getByText("Search");

    // Test initial render
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    // Simulate user typing in the search input
    fireEvent.change(input, { target: { value: "Laptop" } });
    expect(input.value).toBe("Laptop");

    // Simulate clicking the search button
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledWith(setSearchTermAction("Laptop"));

    // Simulate debounce
    vi.useFakeTimers();
    fireEvent.change(input, { target: { value: "Phone" } });
    vi.advanceTimersByTime(500);
    expect(store.dispatch).toHaveBeenCalledWith(setSearchTermAction("Phone"));
    vi.useRealTimers();
  });
});
