import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import Filter from "../../src/components/Filter";
import * as productActions from "../../src/redux/actions/productActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/productActions", () => ({
  setFilter: vi.fn(),
  fetchProducts: vi.fn(),
}));

describe("Filter Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: {
        categories: [
          { slug: "electronics", name: "Electronics" },
          { slug: "clothing", name: "Clothing" },
        ],
        filter: {
          category: "",
          priceRange: [0, Infinity],
        },
        sort: {
          key: "",
          order: "",
        },
        searchTerm: "",
        totalProducts: 0,
        productsPerPage: 20,
        currentPage: 1,
        loading: false,
        error: null,
      },
    });

    store.dispatch = vi.fn();
  });

  test("renders filter component correctly", () => {
    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    expect(screen.getByTestId("filter-select-category")).toBeInTheDocument();
    expect(screen.getByTestId("filter-select-price")).toBeInTheDocument();
  });

  test("dispatches setFilter action on category change", () => {
    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    fireEvent.change(screen.getByTestId("filter-select-category"), {
      target: { value: "electronics" },
    });

    expect(productActions.setFilter).toHaveBeenCalledWith("electronics", null);
  });

  test("dispatches setFilter action on price change", () => {
    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    fireEvent.change(screen.getByTestId("filter-select-price"), {
      target: { value: "50-100" },
    });

    expect(productActions.setFilter).toHaveBeenCalledWith(null, [50, 100]);
  });

  test("updates selected category value correctly", async () => {
    productActions.setFilter.mockImplementation(
      (category, priceRange) => (dispatch) => {
        dispatch({ type: "SET_FILTER", payload: { category, priceRange } });
      }
    );

    const updatedStore = mockStore({
      products: {
        categories: [
          { slug: "electronics", name: "Electronics" },
          { slug: "clothing", name: "Clothing" },
        ],
        filter: {
          category: "clothing",
          priceRange: [0, Infinity],
        },
        sort: {
          key: "",
          order: "",
        },
        searchTerm: "",
        totalProducts: 0,
        productsPerPage: 20,
        currentPage: 1,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={updatedStore}>
        <Filter />
      </Provider>
    );

    const selectCategory = screen.getByTestId("filter-select-category");
    fireEvent.change(selectCategory, { target: { value: "clothing" } });

    await waitFor(() => {
      expect(selectCategory.value).toBe("clothing");
    });
  });

  test("updates selected price range value correctly", async () => {
    productActions.setFilter.mockImplementation(
      (category, priceRange) => (dispatch) => {
        dispatch({ type: "SET_FILTER", payload: { category, priceRange } });
      }
    );

    const updatedStore = mockStore({
      products: {
        categories: [
          { slug: "electronics", name: "Electronics" },
          { slug: "clothing", name: "Clothing" },
        ],
        filter: {
          category: "",
          priceRange: [50, 100],
        },
        sort: {
          key: "",
          order: "",
        },
        searchTerm: "",
        totalProducts: 0,
        productsPerPage: 20,
        currentPage: 1,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={updatedStore}>
        <Filter />
      </Provider>
    );

    const selectPrice = screen.getByTestId("filter-select-price");
    fireEvent.change(selectPrice, { target: { value: "50-100" } });

    await waitFor(() => {
      expect(selectPrice.value).toBe("50-100");
    });
  });
});
