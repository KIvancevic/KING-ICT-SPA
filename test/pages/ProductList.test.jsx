import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../../src/pages/ProductList";
import * as productActions from "../../src/redux/actions/productActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/productActions");

describe("ProductList", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      products: {
        products: [],
        categories: [
          { slug: "category-1", name: "Category 1" },
          { slug: "category-2", name: "Category 2" },
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
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    productActions.fetchProducts.mockImplementation(() => ({
      type: "FETCH_PRODUCTS",
      payload: [],
    }));
    productActions.fetchCategories.mockImplementation(() => ({
      type: "FETCH_CATEGORIES",
      payload: [],
    }));
    productActions.setFilter.mockImplementation((category, priceRange) => ({
      type: "SET_FILTER",
      payload: { category, priceRange },
    }));
    productActions.setSort.mockImplementation((key, order) => ({
      type: "SET_SORT",
      payload: { key, order },
    }));
    productActions.setSearchTerm.mockImplementation(() => ({
      type: "SET_SEARCH_TERM",
      payload: "",
    }));

    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    store = mockStore({
      products: {
        ...store.getState().products,
        loading: true,
      },
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renders product list", async () => {
    store = mockStore({
      products: {
        ...store.getState().products,
        products: [
          {
            id: 1,
            title: "Essence Mascara Lash Princess",
            price: 9.99,
            images: [
              "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
            ],
            description:
              "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
          },
          {
            id: 2,
            title: "Product 2",
            price: 200,
            images: ["img2.jpg"],
            description: "This is product 2",
          },
        ],
        totalProducts: 2,
      },
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    const productTitles = screen.getAllByText(/Essence Mascara Lash Princess/i);
    const productPrices = screen.getAllByText(/\$9.99/i);
    const product2Titles = screen.getAllByText(/Product 2/i);
    const product2Prices = screen.getAllByText(/\$200/i);

    expect(productTitles.length).toBeGreaterThan(0);
    expect(productPrices.length).toBeGreaterThan(0);
    expect(product2Titles.length).toBeGreaterThan(0);
    expect(product2Prices.length).toBeGreaterThan(0);
  });

  test("handles product details modal", async () => {
    store = mockStore({
      products: {
        ...store.getState().products,
        products: [
          {
            id: 1,
            title: "Essence Mascara Lash Princess",
            price: 9.99,
            images: [
              "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
            ],
            description:
              "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
            tags: ["volumizing", "lengthening"],
            category: "beauty",
            brand: "Essence",
            sku: "12345",
            weight: 50,
            dimensions: {
              width: 5,
              height: 10,
              depth: 2,
            },
            discountPercentage: 7.17,
            rating: 4.94,
            stock: 5,
            availabilityStatus: "In Stock",
            warrantyInformation: "2 years",
            shippingInformation: "Ships in 3-5 days",
            returnPolicy: "30-day return policy",
            reviews: [
              {
                rating: 5,
                comment: "Excellent product!",
                date: "2024-01-01T12:00:00.000Z",
                reviewerName: "Alice",
              },
            ],
          },
        ],
      },
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("details-button-1"));

    await waitFor(() => {
      expect(screen.getByTestId("product-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Close/i }));

    await waitFor(() => {
      expect(screen.queryByTestId("product-modal")).not.toBeInTheDocument();
    });
  });

  test("handles filter change", async () => {
    store = mockStore({
      products: {
        ...store.getState().products,
        categories: [
          { slug: "category-1", name: "Category 1" },
          { slug: "category-2", name: "Category 2" },
        ],
      },
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByTestId("filter-select-category"), {
      target: { value: "category-1" },
    });

    await waitFor(() => {
      expect(productActions.setFilter).toHaveBeenCalledWith("category-1", null);
    });
  });

  test("handles sort change", async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByTestId("sort-select"), {
      target: { value: "price-asc" },
    });

    await waitFor(() => {
      expect(productActions.setSort).toHaveBeenCalledWith("price", "asc");
    });
  });

  test("handles search", async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Search/i), {
      target: { value: "Essence Mascara" },
    });

    await waitFor(() => {
      expect(productActions.setSearchTerm).toHaveBeenCalledWith(
        "Essence Mascara"
      );
    });
  });

  test("handles pagination", async () => {
    store = mockStore({
      products: {
        ...store.getState().products,
        totalProducts: 30,
        productsPerPage: 10,
      },
      user: { user: { id: 1, firstName: "John", email: "john@example.com" } },
      cart: {
        userCart: {
          1: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProductList />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getAllByRole("button", { name: "2" })[0]);

    await waitFor(() => {
      expect(productActions.fetchProducts).toHaveBeenCalled();
    });
  });
});
