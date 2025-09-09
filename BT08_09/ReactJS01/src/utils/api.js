import axios from './axios.customize'

export const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register'
  const data = { name, email, password }
  return axios.post(URL_API, data)
}

export const loginApi = (email, password) => {
  const URL_API = '/v1/api/login'
  const data = { email, password }
  return axios.post(URL_API, data)
}

export const getUserApi = () => {
  const URL_API = '/v1/api/user'
  return axios.get(URL_API)
}

// Product APIs
export const getProductsApi = (params = {}) => {
  const URL_API = '/v1/api/products'
  return axios.get(URL_API, { params })
}

export const getProductByIdApi = (id) => {
  const URL_API = `/v1/api/products/${id}`
  return axios.get(URL_API)
}

export const getCategoriesApi = () => {
  const URL_API = '/v1/api/products/categories'
  return axios.get(URL_API)
}

export const getFeaturedProductsApi = (limit = 8) => {
  const URL_API = '/v1/api/products/featured'
  return axios.get(URL_API, { params: { limit } })
}

export const getProductsByCategoryApi = (category, params = {}) => {
  const URL_API = `/v1/api/products/category/${category}`
  return axios.get(URL_API, { params })
}

// Search APIs
export const searchProductsApi = (searchTerm, params = {}) => {
  const URL_API = '/v1/api/products/search'
  return axios.get(URL_API, { params: { q: searchTerm, ...params } })
}

export const fuzzySearchApi = (searchTerm, params = {}) => {
  const URL_API = '/v1/api/products/fuzzy-search'
  return axios.get(URL_API, { params: { q: searchTerm, ...params } })
}

export const filterProductsApi = (filters = {}) => {
  const URL_API = '/v1/api/products/filter'
  return axios.get(URL_API, { params: filters })
}

export const getSearchSuggestionsApi = (searchTerm, limit = 10) => {
  const URL_API = '/v1/api/products/suggestions'
  return axios.get(URL_API, { params: { q: searchTerm, limit } })
}

export const getFilterOptionsApi = () => {
  const URL_API = '/v1/api/products/filter-options'
  return axios.get(URL_API)
}

export const updateViewCountApi = (id) => {
  const URL_API = `/v1/api/products/${id}/view`
  return axios.put(URL_API)
}

// Admin APIs (cần authentication)
export const createProductApi = (productData) => {
  const URL_API = '/v1/api/products'
  return axios.post(URL_API, productData)
}

export const updateProductApi = (id, productData) => {
  const URL_API = `/v1/api/products/${id}`
  return axios.put(URL_API, productData)
}

export const deleteProductApi = (id) => {
  const URL_API = `/v1/api/products/${id}`
  return axios.delete(URL_API)
}

export const addReviewApi = (id, reviewData) => {
  const URL_API = `/v1/api/products/${id}/reviews`
  return axios.post(URL_API, reviewData)
}