import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchProducts = async (
  searchTerm = "",
  page = 1,
  filter = { category: "", priceRange: [0, Infinity] },
  sort = { key: "", order: "" },
  limit = 20
) => {
  try {
    let endpoint = `/products`;
    let params = {
      limit: 0,
      skip: 0,
    };

    const response = await api.get(endpoint, { params });
    let products = response.data.products;

    if (filter.category) {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === filter.category.toLowerCase()
      );
    }

    products = products.filter(
      (product) =>
        product.price >= filter.priceRange[0] &&
        product.price <= filter.priceRange[1]
    );

    if (searchTerm) {
      products = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sort.key) {
      products.sort((a, b) => {
        if (sort.key === "name" || sort.key === "title") {
          return sort.order === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        } else {
          return sort.order === "desc"
            ? b[sort.key] - a[sort.key]
            : a[sort.key] - b[sort.key];
        }
      });
    }

    const total = products.length;
    const paginatedProducts = products.slice((page - 1) * limit, page * limit);

    return {
      products: paginatedProducts,
      total,
      page,
    };
  } catch (error) {
    throw new Error("Error fetching products");
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get(`/products/categories`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};
