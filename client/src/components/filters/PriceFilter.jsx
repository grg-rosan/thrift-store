

import { useState } from 'react'

export default function PriceFilter({
  priceRange,
  onPriceChange,
  presets,
}) {
  const [showCustom, setShowCustom] = useState(false)
  const [customMin, setCustomMin] = useState('')
  const [customMax, setCustomMax] = useState('')

  const handlePresetClick = (min, max) => {
    onPriceChange(min, max)
    setShowCustom(false)
  }

  const handleApplyCustom = () => {
    const min = customMin ? parseFloat(customMin) : 0
    const max = customMax ? parseFloat(customMax) : Infinity
    onPriceChange(min, max)
    setShowCustom(false)
  }

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div className="space-y-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset.min, preset.max)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition text-left ${
              priceRange[0] === preset.min && priceRange[1] === preset.max
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Range Toggle */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-left"
      >
        Custom Range
      </button>

      {/* Custom Range Inputs */}
      {showCustom && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="0"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="999"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            onClick={handleApplyCustom}
            className="w-full px-2 py-1 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
