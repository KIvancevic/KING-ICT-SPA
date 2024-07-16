import {
  FETCH_PRODUCTS,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES,
  SET_FILTER,
  SET_SORT,
  SET_SEARCH_TERM,
} from "../types";

const initialState = {
  products: [],
  categories: [],
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
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.total,
        loading: false,
        currentPage: action.payload.page,
      };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_FILTER:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
        currentPage: 1,
      };
    case SET_SORT:
      return {
        ...state,
        sort: action.payload,
        currentPage: 1,
      };
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1,
      };
    default:
      return state;
  }
};

export default productReducer;
