import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES,
  SET_FILTER,
  SET_SORT,
  SET_SEARCH_TERM,
} from "../types";
import {
  fetchProducts as fetchProductsApi,
  fetchCategories as fetchCategoriesApi,
} from "../services/api";

export const fetchProducts =
  (
    searchTerm = "",
    page = 1,
    filter = { category: "", priceRange: [0, Infinity] },
    sort = { key: "", order: "" }
  ) =>
  async (dispatch, getState) => {
    dispatch({ type: FETCH_PRODUCTS });

    const state = getState().products;
    const currentFilter = filter || state.filter;
    const currentSort = sort || state.sort;
    const currentSearchTerm = searchTerm || state.searchTerm;

    try {
      const response = await fetchProductsApi(
        currentSearchTerm,
        page,
        currentFilter,
        currentSort
      );

      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: {
          products: response.products,
          total: response.total,
          page: page,
        },
      });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };

export const fetchCategories = () => async (dispatch) => {
  try {
    const categories = await fetchCategoriesApi();
    dispatch({ type: FETCH_CATEGORIES, payload: categories });
  } catch (error) {
    console.error("Error fetching categories", error);
  }
};

export const setFilter = (category, priceRange) => (dispatch, getState) => {
  const currentFilter = getState().products.filter;
  const newFilter = {
    category: category !== null ? category : currentFilter.category,
    priceRange: priceRange !== null ? priceRange : currentFilter.priceRange,
  };

  const filterChanged =
    newFilter.category !== currentFilter.category ||
    newFilter.priceRange[0] !== currentFilter.priceRange[0] ||
    newFilter.priceRange[1] !== currentFilter.priceRange[1];

  if (filterChanged) {
    dispatch({ type: SET_FILTER, payload: newFilter });
    dispatch(
      fetchProducts(
        getState().products.searchTerm,
        1,
        newFilter,
        getState().products.sort
      )
    );
  }
};

export const setSort = (key, order) => (dispatch, getState) => {
  const { sort } = getState().products;
  if (sort.key !== key || sort.order !== order) {
    dispatch({ type: SET_SORT, payload: { key, order } });
    dispatch(
      fetchProducts(
        getState().products.searchTerm,
        1,
        getState().products.filter,
        { key, order }
      )
    );
  }
};

export const setSearchTerm = (searchTerm) => (dispatch, getState) => {
  dispatch({ type: SET_SEARCH_TERM, payload: searchTerm });
  dispatch(
    fetchProducts(
      searchTerm,
      1,
      getState().products.filter,
      getState().products.sort
    )
  );
};
