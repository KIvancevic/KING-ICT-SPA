import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import Pagination from "../../src/components/Pagination";
import * as productActions from "../../src/redux/actions/productActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/productActions", () => ({
  fetchProducts: vi.fn(),
}));

describe("Pagination Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: {
        searchTerm: "",
        filter: { category: "", priceRange: [0, Infinity] },
        sort: { key: "", order: "" },
      },
    });

    store.dispatch = vi.fn();
  });

  test("renders pagination component correctly", () => {
    render(
      <Provider store={store}>
        <Pagination totalPages={5} currentPage={3} />
      </Provider>
    );

    expect(screen.getByText("<<")).toBeInTheDocument();
    expect(screen.getByText("<")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
    expect(screen.getByText(">>")).toBeInTheDocument();
  });

  test("dispatches fetchProducts action on page change", () => {
    render(
      <Provider store={store}>
        <Pagination totalPages={5} currentPage={3} />
      </Provider>
    );

    fireEvent.click(screen.getByText("4"));

    expect(productActions.fetchProducts).toHaveBeenCalledWith(
      "",
      4,
      { category: "", priceRange: [0, Infinity] },
      { key: "", order: "" }
    );
  });

  test("disables buttons correctly based on current page", () => {
    render(
      <Provider store={store}>
        <Pagination totalPages={5} currentPage={1} />
      </Provider>
    );

    expect(screen.getByText("<<")).toBeDisabled();
    expect(screen.getByText("<")).toBeDisabled();
    expect(screen.getByText("1")).toBeDisabled();
    expect(screen.getByText(">")).not.toBeDisabled();
    expect(screen.getByText(">>")).not.toBeDisabled();
  });

  test("disables next and last buttons on last page", () => {
    render(
      <Provider store={store}>
        <Pagination totalPages={5} currentPage={5} />
      </Provider>
    );

    expect(screen.getByText("<<")).not.toBeDisabled();
    expect(screen.getByText("<")).not.toBeDisabled();
    expect(screen.getByText("5")).toBeDisabled();
    expect(screen.getByText(">")).toBeDisabled();
    expect(screen.getByText(">>")).toBeDisabled();
  });
});
