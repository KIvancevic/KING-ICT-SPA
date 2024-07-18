import React from "react";
import "./ProductModal.css";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="product-modal" data-testid="product-modal">
      <button onClick={onClose}>Close</button>
      <img src={product.images[0]} alt={product.title} />
      <h2>{product.title}</h2>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Discount: {product.discountPercentage}%</p>
      <p>Rating: {product.rating}</p>
      <p>
        Stock: {product.stock} (Availability: {product.availabilityStatus})
      </p>
      <p>Category: {product.category}</p>
      <p>Tags: {product.tags.join(", ")}</p>
      <p>Brand: {product.brand}</p>
      <p>SKU: {product.sku}</p>
      <p>Weight: {product.weight}g</p>
      <p>
        Dimensions: {product.dimensions.width} x {product.dimensions.height} x{" "}
        {product.dimensions.depth} mm
      </p>
      <p>Warranty: {product.warrantyInformation}</p>
      <p>Shipping: {product.shippingInformation}</p>
      <p>Return Policy: {product.returnPolicy}</p>
      <p>Description: {product.description}</p>

      <div className="product-reviews">
        <h3>Reviews:</h3>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              <p>
                Reviewer: {review.reviewerName} (
                {new Date(review.date).toLocaleDateString()})
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
