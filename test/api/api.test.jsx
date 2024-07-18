import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { fetchProducts, fetchCategories } from "../../src/redux/services/api";
import { handlers } from "../mock/handlers";
import { http } from "msw";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Services", () => {
  it("fetchCategories should return categories", async () => {
    const result = await fetchCategories();

    expect(result).toEqual(["beauty", "electronics", "clothing"]);
  });

  it("fetchProducts should throw an error when the API call fails", async () => {
    server.use(
      http.get("https://dummyjson.com/products", async (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await expect(fetchProducts()).rejects.toThrow("Error fetching products");
  });

  it("fetchCategories should throw an error when the API call fails", async () => {
    server.use(
      http.get(
        "https://dummyjson.com/products/categories",
        async (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    await expect(fetchCategories()).rejects.toThrow(
      "Error fetching categories"
    );
  });
});
