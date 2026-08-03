export function formatPrice(price, isFree) {
  if (isFree || price === 0) {
    return 'Free'
  }
  return `$${price}`
}

export function formatRelativeTime(date) {
  if (!date) return ''
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

export function formatMemberSince(date) {
  if (!date) return ''
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) return `Member for ${diffYears} year${diffYears > 1 ? 's' : ''}`
  if (diffMonths > 0) return `Member for ${diffMonths} month${diffMonths > 1 ? 's' : ''}`
  return `Member for ${diffDays} day${diffDays > 1 ? 's' : ''}`
}

export function formatRating(rating) {
  return rating.toFixed(1)
}
