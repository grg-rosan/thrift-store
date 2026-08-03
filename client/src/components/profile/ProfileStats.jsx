
import { formatMemberSince } from '../../utils/formatters'

export default function ProfileStats({ profile, listingsCount }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {profile.avgRating.toFixed(1)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ★ Rating ({profile.ratingCount})
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{listingsCount}</div>
          <p className="text-sm text-gray-600 mt-1">Listings</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">
            {formatMemberSince(profile.createdAt)}
          </div>
          <p className="text-sm text-gray-600 mt-1">Member</p>
        </div>
      </div>
    </div>
  )
}
