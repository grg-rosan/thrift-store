import { useState, useCallback } from 'react'
import { LISTINGS } from '../data/mockData'
import { STATUS } from '../utils/constants'

export function useProducts() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [priceRange, setPriceRange] = useState([0, Infinity])

  const getProductById = useCallback((id) => {
    return LISTINGS.find((product) => product.id === Number(id))
  }, [])

  const getFilteredProducts = useCallback(() => {
    return LISTINGS.filter((product) => {
      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
        return false
      }

      // Filter by price
      const price = product.price || 0
      if (price < priceRange[0] || price > priceRange[1]) {
        return false
      }

      return true
    })
  }, [selectedCategory, priceRange])

  const filterByCategory = useCallback((category) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }, [selectedCategory])

  const filterByPrice = useCallback((min, max) => {
    setPriceRange([min, max])
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedCategory(null)
    setPriceRange([0, Infinity])
  }, [])

  const getUserListings = useCallback((userId) => {
    return LISTINGS.filter((listing) => listing.seller.id === userId)
  }, [])

  return {
    products: LISTINGS,
    filteredProducts: getFilteredProducts(),
    selectedCategory,
    priceRange,
    getProductById,
    filterByCategory,
    filterByPrice,
    clearFilters,
    getUserListings,
  }
}
