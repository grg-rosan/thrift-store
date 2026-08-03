import { useState, useEffect } from 'react'

const STORAGE_KEY = 'karrot_favourites'

/**
 * useFavourites hook for managing favourite listings
 * Works for both guest users (localStorage) and authenticated users
 * Structured to allow easy backend integration by replacing storage layer
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favourites from localStorage on mount
  useEffect(() => {
    const loadFavourites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? JSON.parse(stored) : []
        setFavourites(parsed)
      } catch (error) {
        console.error('[v0] Failed to load favourites from localStorage:', error)
        setFavourites([])
      }
      setIsLoaded(true)
    }

    loadFavourites()
  }, [])

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
      } catch (error) {
        console.error('[v0] Failed to save favourites to localStorage:', error)
      }
    }
  }, [favourites, isLoaded])

  const getFavourites = () => {
    return favourites
  }

  const getFavouriteIds = () => {
    return favourites.map(fav => fav.listingId)
  }

  const isFavourited = (listingId) => {
    return favourites.some(fav => fav.listingId === listingId)
  }

  const addFavourite = (listingId) => {
    if (!isFavourited(listingId)) {
      const newFavourite = {
        listingId,
        createdAt: new Date().toISOString(),
      }
      setFavourites([...favourites, newFavourite])
      return true
    }
    return false
  }

  const removeFavourite = (listingId) => {
    const filtered = favourites.filter(fav => fav.listingId !== listingId)
    if (filtered.length !== favourites.length) {
      setFavourites(filtered)
      return true
    }
    return false
  }

  const toggleFavourite = (listingId) => {
    if (isFavourited(listingId)) {
      removeFavourite(listingId)
      return false
    } else {
      addFavourite(listingId)
      return true
    }
  }

  const clearFavourites = () => {
    setFavourites([])
  }

  return {
    favourites,
    getFavourites,
    getFavouriteIds,
    isFavourited,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearFavourites,
    isLoaded,
  }
}
