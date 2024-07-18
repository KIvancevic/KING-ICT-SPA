import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import {
  fetchProducts,
  fetchCategories,
  setFilter,
  setSort,
  setSearchTerm,
} from "../../../src/redux/actions/productActions";
import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES,
  SET_FILTER,
  SET_SORT,
  SET_SEARCH_TERM,
} from "../../../src/redux/types";
import { server } from "../../setupTest";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Product Actions", () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const initialState = {
    products: {
      filter: { category: "", priceRange: [0, Infinity] },
      sort: { key: "", order: "" },
      searchTerm: "",
    },
  };

  const productData = {
    products: [{ id: 1, name: "Product 1", category: "Category 1", price: 50 }],
    total: 1,
  };

  const searchData = {
    products: [
      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        category: "beauty",
        price: 9.99,
      },
    ],
    total: 1,
  };

  it("fetchProducts should dispatch FETCH_PRODUCTS_SUCCESS on successful fetch", async () => {
    const store = mockStore(initialState);

    server.use(
      http.get("https://dummyjson.com/products", async (req) => {
        return HttpResponse.json(productData);
      })
    );

    await store.dispatch(fetchProducts());
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: FETCH_PRODUCTS });
    expect(actions[1]).toEqual({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products: productData.products,
        total: productData.total,
        page: 1,
      },
    });
  });

  it("fetchProducts should dispatch FETCH_PRODUCTS_FAILURE on failed fetch", async () => {
    const store = mockStore(initialState);

    server.use(
      http.get("https://dummyjson.com/products", async (req) => {
        return HttpResponse.json({ message: "Fetch failed" }, { status: 500 });
      })
    );

    await store.dispatch(fetchProducts());
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: FETCH_PRODUCTS });
    expect(actions[1]).toEqual({
      type: FETCH_PRODUCTS_FAILURE,
      payload: "Error fetching products",
    });
  });

  it("fetchCategories should dispatch FETCH_CATEGORIES on successful fetch", async () => {
    const store = mockStore({});
    const categoriesData = [
      {
        name: "Beauty",
        slug: "beauty",
        url: "https://dummyjson.com/products/category/beauty",
      },
      {
        name: "Fragrances",
        slug: "fragrances",
        url: "https://dummyjson.com/products/category/fragrances",
      },
    ];

    server.use(
      http.get("https://dummyjson.com/products/categories", async (req) => {
        return HttpResponse.json(categoriesData);
      })
    );

    await store.dispatch(fetchCategories());
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: FETCH_CATEGORIES,
      payload: categoriesData,
    });
  });

  it("setFilter should dispatch SET_FILTER and fetchProducts if filter changes", async () => {
    const store = mockStore(initialState);

    server.use(
      http.get("https://dummyjson.com/products", async (req) => {
        return HttpResponse.json(productData);
      })
    );

    await store.dispatch(setFilter("Category 1", [0, 100]));
    await vi.runAllTimers();

    await new Promise((resolve) => setTimeout(resolve, 0));
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: SET_FILTER,
      payload: { category: "Category 1", priceRange: [0, 100] },
    });
    expect(actions[1]).toEqual({ type: FETCH_PRODUCTS });
    expect(actions[2]).toEqual({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products: productData.products,
        total: productData.total,
        page: 1,
      },
    });
  });

  it("setSort should dispatch SET_SORT and fetchProducts if sort changes", async () => {
    const store = mockStore(initialState);

    server.use(
      http.get("https://dummyjson.com/products", async (req) => {
        return HttpResponse.json(productData);
      })
    );

    await store.dispatch(setSort("price", "asc"));
    await vi.runAllTimers();

    await new Promise((resolve) => setTimeout(resolve, 0));
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: SET_SORT,
      payload: { key: "price", order: "asc" },
    });
    expect(actions[1]).toEqual({ type: FETCH_PRODUCTS });
    expect(actions[2]).toEqual({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products: productData.products,
        total: productData.total,
        page: 1,
      },
    });
  });

  it("setSearchTerm should dispatch SET_SEARCH_TERM and fetchProducts", async () => {
    const store = mockStore(initialState);

    server.use(
      http.get("https://dummyjson.com/products", async (req) => {
        return HttpResponse.json(searchData);
      })
    );

    await store.dispatch(setSearchTerm("Essence Mascara Lash Princess"));
    await vi.runAllTimers();

    await new Promise((resolve) => setTimeout(resolve, 0));
    await vi.runAllTimers();

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: SET_SEARCH_TERM,
      payload: "Essence Mascara Lash Princess",
    });
    expect(actions[1]).toEqual({ type: FETCH_PRODUCTS });
    expect(actions[2]).toEqual({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: {
        products: searchData.products,
        total: searchData.total,
        page: 1,
      },
    });
  });
});
