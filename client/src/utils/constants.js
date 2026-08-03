export const STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
}

export const PRICE_PRESETS = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under $50', min: 0.01, max: 50 },
  { label: '$50 - $200', min: 50, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
]
