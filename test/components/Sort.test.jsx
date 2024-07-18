import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import Sort from "../../src/components/Sort";
import * as productActions from "../../src/redux/actions/productActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/productActions", () => ({
  setSort: vi.fn().mockImplementation((key, order) => {
    return (dispatch) => {
      dispatch({ type: "SET_SORT", payload: { key, order } });
    };
  }),
}));

describe("Sort Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: {
        sort: {
          key: "",
          order: "",
        },
      },
    });

    store.dispatch = vi.fn();
  });

  test("renders sort component correctly", () => {
    render(
      <Provider store={store}>
        <Sort />
      </Provider>
    );

    expect(screen.getByTestId("sort-select")).toBeInTheDocument();
  });

  test("dispatches setSort action on sort change", () => {
    render(
      <Provider store={store}>
        <Sort />
      </Provider>
    );

    fireEvent.change(screen.getByTestId("sort-select"), {
      target: { value: "price-asc" },
    });

    expect(productActions.setSort).toHaveBeenCalledWith("price", "asc");
  });

  test("updates selected sort value correctly", async () => {
    const { rerender } = render(
      <Provider store={store}>
        <Sort />
      </Provider>
    );

    const selectSort = screen.getByTestId("sort-select");

    fireEvent.change(selectSort, { target: { value: "title-desc" } });

    await waitFor(() => {
      expect(productActions.setSort).toHaveBeenCalledWith("title", "desc");
    });

    store = mockStore({
      products: {
        sort: {
          key: "title",
          order: "desc",
        },
      },
    });

    rerender(
      <Provider store={store}>
        <Sort />
      </Provider>
    );

    expect(screen.getByTestId("sort-select").value).toBe("title-desc");
  });
});
