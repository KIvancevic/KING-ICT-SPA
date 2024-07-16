import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSort } from "../redux/actions/productActions";
import "./Sort.css";

const Sort = () => {
  const dispatch = useDispatch();
  const { sort } = useSelector((state) => state.products);

  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    if (sort.key !== key || sort.order !== order) {
      dispatch(setSort(key, order));
    }
  };

  return (
    <>
      <select onChange={handleSortChange} value={`${sort.key}-${sort.order}`}>
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="title-asc">Name: A to Z</option>
        <option value="title-desc">Name: Z to A</option>
      </select>
    </>
  );
};

export default Sort;
