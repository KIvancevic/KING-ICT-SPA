import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../redux/actions/productActions";
import "./Filter.css";

const Filter = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.products.categories);
  const filter = useSelector((state) => state.products.filter);

  const handleCategoryChange = (e) => {
    dispatch(setFilter(e.target.value, null));
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value
      .split("-")
      .map((val) => (val === "Infinity" ? Infinity : Number(val)));
    dispatch(setFilter(null, [min, max]));
  };

  const priceRange = filter.priceRange || [0, Infinity];

  return (
    <>
      <select
        data-testid="filter-select-category"
        value={filter.category}
        onChange={handleCategoryChange}
      >
        <option value="">Filter by category</option>
        {categories.map((category, i) => (
          <option key={i} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        data-testid="filter-select-price"
        value={`${priceRange[0]}-${priceRange[1]}`}
        onChange={handlePriceChange}
      >
        <option value="0-Infinity">Filter by price range</option>
        <option value="0-50">0-50$</option>
        <option value="50-100">50-100$</option>
        <option value="100-Infinity">100$+</option>
      </select>
    </>
  );
};

export default Filter;
