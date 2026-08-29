import Api from "./Api";

// Fetch all products — backend returns { products: [], total, page, pages }
export const fetchProducts = async (params = {}) => {
  try {
    const response = await Api.get("/products/", { params });
    return response.data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await Api.get("/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch featured product (top-rated fallback)
export const fetchFeaturedProduct = async () => {
  try {
    const response = await Api.get("/products/featured/");
    return response.data;
  } catch {
    const products = await fetchProducts({ sort: "rating", page_size: 1 });
    return products.length > 0 ? products[0] : null;
  }
};

// Fetch trending products — uses recommendations endpoint's 'trending' key
export const fetchTrendingProducts = async () => {
  try {
    const response = await Api.get("/products/trending/");
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    try {
      // Use the recommendations endpoint which has a 'trending' key
      const res = await Api.get("/recommendations/");
      return res.data.trending || res.data.new_arrivals || [];
    } catch {
      return await fetchProducts({ sort: "newest", page_size: 8 });
    }
  }
};

// Fetch featured collection (mock fallback from newest products)
export const fetchFeaturedCollection = async () => {
  try {
    const response = await Api.get("/collections/featured/");
    return response.data;
  } catch {
    const products = await fetchProducts({ sort: "newest", page_size: 4 });
    return {
      title: "Artisan Handmade Collection",
      description: "Discover our curated selection of premium handcrafted items crafted by master artisans.",
      products,
    };
  }
};

// Fetch personalized recommendations
// Backend returns: { recommended: [...], trending: [...], new_arrivals: [...] }
export const fetchRecommendations = async () => {
  try {
    const response = await Api.get("/recommendations/");
    const data = response.data;
    // Extract array: prefer 'recommended', then 'new_arrivals', then the data itself
    if (Array.isArray(data)) return data.slice(0, 4);
    if (Array.isArray(data.recommended)) return data.recommended.slice(0, 4);
    if (Array.isArray(data.new_arrivals)) return data.new_arrivals.slice(0, 4);
    return [];
  } catch {
    return await fetchProducts({ sort: "rating", page_size: 4 });
  }
};

// Fetch cart — returns { items, total_items, subtotal }
export const fetchCart = async () => {
  try {
    const response = await Api.get("/cart/");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { total_items: 0 };
  }
};
