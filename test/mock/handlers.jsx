import { http, HttpResponse } from "msw";

const handlers = [
  http.post("https://dummyjson.com/auth/login", async (req) => {
    const { username, password } = await req.json();
    if (username === "testUser" && password === "testPass") {
      return HttpResponse.json({
        token: "fakeToken",
        refreshToken: "fakeRefreshToken",
      });
    } else {
      return HttpResponse.json(
        {
          message: "Login failed",
        },
        { status: 401 }
      );
    }
  }),

  http.post("https://dummyjson.com/auth/refresh", async (req) => {
    const { refreshToken } = await req.json();
    if (refreshToken === "fakeRefreshToken") {
      return HttpResponse.json({
        token: "newFakeToken",
        refreshToken: "newFakeRefreshToken",
      });
    } else {
      return HttpResponse.json(
        {
          message: "Refresh token failed",
        },
        { status: 401 }
      );
    }
  }),

  http.get("https://dummyjson.com/products", (req) => {
    const mockProducts = [
      {
        id: 1,
        title: "Essence Mascara Lash Princess",
        description:
          "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
        category: "beauty",
        price: 9.99,
        discountPercentage: 7.17,
        rating: 4.94,
        stock: 5,
        tags: ["beauty", "mascara"],
        brand: "Essence",
        sku: "RCH45Q1A",
        weight: 2,
        dimensions: {
          width: 23.17,
          height: 14.43,
          depth: 28.01,
        },
        warrantyInformation: "1 month warranty",
        shippingInformation: "Ships in 1 month",
        availabilityStatus: "Low Stock",
        reviews: [
          {
            rating: 2,
            comment: "Very unhappy with my purchase!",
            date: "2024-05-23T08:56:21.618Z",
            reviewerName: "John Doe",
            reviewerEmail: "john.doe@x.dummyjson.com",
          },
          {
            rating: 2,
            comment: "Not as described!",
            date: "2024-05-23T08:56:21.618Z",
            reviewerName: "Nolan Gonzalez",
            reviewerEmail: "nolan.gonzalez@x.dummyjson.com",
          },
          {
            rating: 5,
            comment: "Very satisfied!",
            date: "2024-05-23T08:56:21.618Z",
            reviewerName: "Scarlett Wright",
            reviewerEmail: "scarlett.wright@x.dummyjson.com",
          },
        ],
        returnPolicy: "30 days return policy",
        minimumOrderQuantity: 24,
        meta: {
          createdAt: "2024-05-23T08:56:21.618Z",
          updatedAt: "2024-05-23T08:56:21.618Z",
          barcode: "9164035109868",
          qrCode: "https://assets.dummyjson.com/public/qr-code.png",
        },
        images: [
          "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
        ],
        thumbnail:
          "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
      },
      {
        id: 2,
        title: "Some Other Product",
        category: "electronics",
        price: 19.99,
        description: "A great product.",
        discountPercentage: 5,
        rating: 4.5,
        stock: 15,
        tags: ["electronics", "gadget"],
        brand: "Generic",
        sku: "GEN45Q1A",
        weight: 1.5,
        dimensions: {
          width: 15.17,
          height: 10.43,
          depth: 20.01,
        },
        warrantyInformation: "6 month warranty",
        shippingInformation: "Ships in 2 weeks",
        availabilityStatus: "In Stock",
        reviews: [],
        returnPolicy: "15 days return policy",
        minimumOrderQuantity: 10,
        meta: {
          createdAt: "2024-05-23T08:56:21.618Z",
          updatedAt: "2024-05-23T08:56:21.618Z",
          barcode: "9164035109870",
          qrCode: "https://assets.dummyjson.com/public/qr-code.png",
        },
        images: [
          "https://cdn.dummyjson.com/products/images/electronics/Some%20Other%20Product/1.png",
        ],
        thumbnail:
          "https://cdn.dummyjson.com/products/images/electronics/Some%20Other%20Product/thumbnail.png",
      },
    ];

    const category = req.url.searchParams.get("category");
    const priceRange = req.url.searchParams.get("priceRange")
      ? req.url.searchParams.get("priceRange").split(",").map(Number)
      : [0, Infinity];
    const searchTerm = req.url.searchParams.get("searchTerm") || "";
    const sortKey = req.url.searchParams.get("sortKey") || "";
    const sortOrder = req.url.searchParams.get("sortOrder") || "";

    let filteredProducts = mockProducts;

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortKey) {
      filteredProducts.sort((a, b) => {
        if (sortKey === "name" || sortKey === "title") {
          return sortOrder === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        } else {
          return sortOrder === "desc"
            ? b[sortKey] - a[sortKey]
            : a[sortKey] - b[sortKey];
        }
      });
    }

    return HttpResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      page: 1,
    });
  }),

  http.get("https://dummyjson.com/products/categories", () => {
    return HttpResponse.json(["beauty", "electronics", "clothing"]);
  }),
];

export { handlers };
