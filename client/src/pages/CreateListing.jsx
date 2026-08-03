
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, X, Upload } from 'lucide-react'
import { CATEGORIES } from '../data/mockData'

export default function CreateListing() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    isFree: false,
    category: '',
  })
  const [uploadedImages, setUploadedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const remainingSlots = 5 - uploadedImages.length

    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more photo(s)`)
      return
    }

    // Create preview URLs for uploaded files
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      order: uploadedImages.length + files.indexOf(file),
    }))

    setUploadedImages([...uploadedImages, ...newImages])
  }

  const removeImage = (id) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== id)
      // Cleanup object URL
      const removed = prev.find(img => img.id === id)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return filtered
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description')
      setIsSubmitting(false)
      return
    }

    if (!formData.isFree && !formData.price) {
      alert('Please enter a price or mark as free')
      setIsSubmitting(false)
      return
    }

    if (!formData.category) {
      alert('Please select a category')
      setIsSubmitting(false)
      return
    }

    if (uploadedImages.length === 0) {
      alert('Please upload at least one image')
      setIsSubmitting(false)
      return
    }

    // Simulate API call - in a real app, you'd upload to backend
    console.log('[v0] Creating listing with data:', {
      ...formData,
      images: uploadedImages.map(img => img.preview),
    })

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Redirect to profile page
    setIsSubmitting(false)
    navigate('/profile/current-user')
  }

  const canAddMoreImages = uploadedImages.length < 5
  const imageCountText =
    uploadedImages.length > 0
      ? `${uploadedImages.length} photo${uploadedImages.length !== 1 ? 's' : ''} selected`
      : 'No photos selected'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
        >
          <ChevronLeft size={20} />
          Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sell an item</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What are you selling?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item in detail..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label className="text-gray-700">Mark as free</label>
                </div>

                {!formData.isFree && (
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price in dollars"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (max 5) *
              </label>
              <p className="text-sm text-gray-500 mb-3">{imageCountText}</p>

              {/* Upload Button */}
              {canAddMoreImages && (
                <div className="mb-4">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 cursor-pointer hover:border-orange-500 transition">
                    <Upload size={20} className="text-orange-600" />
                    <span className="text-orange-600 font-medium">Click to upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={!canAddMoreImages}
                    />
                  </label>
                </div>
              )}

              {uploadedImages.length >= 5 && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
                  Maximum 5 photos reached
                </div>
              )}

              {/* Image Thumbnails */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Upload preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 text-center">{idx + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition"
              >
                {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
