import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/actions/productActions";
import "./Pagination.css";

const Pagination = ({ totalPages, currentPage }) => {
  const dispatch = useDispatch();
  const { searchTerm, filter, sort } = useSelector((state) => state.products);

  const handlePageChange = (pageNumber) => {
    if (currentPage !== pageNumber) {
      dispatch(fetchProducts(searchTerm, pageNumber, filter, sort));
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <button
        className="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        {"<<"}
      </button>
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
      <button
        className="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
