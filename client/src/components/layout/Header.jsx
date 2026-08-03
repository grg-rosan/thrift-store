
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Menu, Heart } from 'lucide-react'

export default function Header({ onMenuClick, currentUser }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate(`/profile/${currentUser.id}`)
    setShowProfileMenu(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo & Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-orange-600">Karrot</h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search items..."
            className="flex-1 bg-transparent outline-none ml-2 text-sm"
          />
        </div>

        {/* Right: Address & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full">
            <MapPin size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Williamsburg</span>
          </div>

          {/* Favourites Button */}
          <button
            onClick={() => navigate('/favourites')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="View favourites"
          >
            <Heart size={20} className="text-gray-700" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.neighborhood}</p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  View Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                  Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 bg-gray-50 flex items-center gap-2 rounded-lg mx-4 mb-3">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
    </header>
  )
}
