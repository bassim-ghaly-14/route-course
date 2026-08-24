import { axiosInstance } from './axiosInstance';

const DEFAULT_LIMIT = 20;

/**
 * Server-side product browsing (verified against the live API):
 *   sort      → 'price' | '-price' | '-createdAt' | 'ratingsAverage'
 *   page/limit→ real server pagination via metadata.numberOfPages
 *   price[lte]/price[gte] → server-side price range
 *   category[in], brand   → server-side filters
 *
 * Returns { products, metadata } — metadata drives pagination UI.
 */
export async function getProducts(filters = {}) {
  const {
    page = 1,
    limit = DEFAULT_LIMIT,
    sort,
    categoryId,
    brandId,
    maxPrice,
    minPrice,
  } = filters;

  const params = { page, limit };

  if (sort && sort !== 'default') params.sort = sort;
  if (categoryId) params['category[in]'] = categoryId;
  if (brandId) params.brand = brandId;
  if (minPrice) params['price[gte]'] = minPrice;
  if (maxPrice) params['price[lte]'] = maxPrice;

  const { data } = await axiosInstance.get('/products', { params });

  return {
    products: data.data || [],
    metadata: data.metadata || null,
    totalResults: data.results ?? data.data?.length ?? 0,
  };
}

/**
 * Search data source. NOTE: the API's documented `keyword` parameter was
 * verified live and is BROKEN (it returns 0 results for any query, including
 * exact product titles). The catalog is small (~56 products), so search
 * fetches the full catalog ONCE through this service and filters it in the
 * useProductSearch hook. This is a deliberate, documented workaround — not a
 * fake server contract.
 */
export async function getAllProducts() {
  const { data } = await axiosInstance.get('/products', {
    params: { limit: 200 },
  });
  return data.data || [];
}

export async function getProduct(productId) {
  const { data } = await axiosInstance.get(`/products/${productId}`);
  return data.data;
}

/** Related products of a category, excluding the current product. */
export async function getRelatedProducts(categoryId, productId) {
  const { data } = await axiosInstance.get(
    `/products?category[in]=${categoryId}`
  );
  return (data.data || []).filter((p) => p._id !== productId);
}

export async function getCategoryProducts(categoryId) {
  const { data } = await axiosInstance.get(`/products?category=${categoryId}`);
  return data.data || [];
}