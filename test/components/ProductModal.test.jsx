import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductModal from "../../src/components/ProductModal";

const product = {
  title: "Test Product",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 20,
  availabilityStatus: "In Stock",
  category: "Electronics",
  tags: ["tag1", "tag2"],
  brand: "Test Brand",
  sku: "123456",
  weight: 500,
  dimensions: { width: 10, height: 20, depth: 30 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 2-3 days",
  returnPolicy: "30-day return policy",
  description: "This is a test product description.",
  images: ["test-image.jpg"],
  reviews: [
    {
      rating: 5,
      comment: "Great product!",
      reviewerName: "John Doe",
      date: "2023-07-17T03:24:00",
    },
  ],
};

describe("ProductModal", () => {
  it("should render product details", () => {
    render(<ProductModal product={product} onClose={vi.fn()} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Price: $100.00")).toBeInTheDocument();
    expect(screen.getByText("Discount: 10%")).toBeInTheDocument();
    expect(screen.getByText("Rating: 4.5")).toBeInTheDocument();
    expect(
      screen.getByText("Stock: 20 (Availability: In Stock)")
    ).toBeInTheDocument();
    expect(screen.getByText("Category: Electronics")).toBeInTheDocument();
    expect(screen.getByText("Tags: tag1, tag2")).toBeInTheDocument();
    expect(screen.getByText("Brand: Test Brand")).toBeInTheDocument();
    expect(screen.getByText("SKU: 123456")).toBeInTheDocument();
    expect(screen.getByText("Weight: 500g")).toBeInTheDocument();
    expect(screen.getByText("Dimensions: 10 x 20 x 30 mm")).toBeInTheDocument();
    expect(screen.getByText("Warranty: 1 year warranty")).toBeInTheDocument();
    expect(screen.getByText("Shipping: Ships in 2-3 days")).toBeInTheDocument();
    expect(
      screen.getByText("Return Policy: 30-day return policy")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Description: This is a test product description.")
    ).toBeInTheDocument();
  });

  it("should close the modal when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<ProductModal product={product} onClose={onClose} />);

    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("should render reviews when available", () => {
    render(<ProductModal product={product} onClose={vi.fn()} />);

    expect(screen.getByText("Reviews:")).toBeInTheDocument();
    expect(screen.getByText("Rating: 5")).toBeInTheDocument();
    expect(screen.getByText("Comment: Great product!")).toBeInTheDocument();
    expect(
      screen.getByText("Reviewer: John Doe (7/17/2023)")
    ).toBeInTheDocument();
  });

  it("should render 'No reviews yet.' when no reviews are available", () => {
    const productWithNoReviews = { ...product, reviews: [] };
    render(<ProductModal product={productWithNoReviews} onClose={vi.fn()} />);

    expect(screen.getByText("No reviews yet.")).toBeInTheDocument();
  });
});
