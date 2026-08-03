import { useCallback } from 'react'
import { USERS, LISTINGS, REVIEWS } from '../data/mockData'

export function useProfile() {
  const getCurrentUser = useCallback(() => {
    // Return the first user as current user for mock purposes
    return USERS[0]
  }, [])

  const getProfileByUserId = useCallback((userId) => {
    return USERS.find((user) => user.id === Number(userId))
  }, [])

  const getUserListings = useCallback((userId) => {
    return LISTINGS.filter((listing) => listing.seller.id === Number(userId))
  }, [])

  const getUserReviews = useCallback((userId) => {
    // For now, return all reviews as they could be for any seller
    return REVIEWS
  }, [])

  return {
    currentUser: getCurrentUser(),
    getProfileByUserId,
    getUserListings,
    getUserReviews,
  }
}
