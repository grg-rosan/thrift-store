
export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <img
          src={profile.profileImage}
          alt={profile.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-600">{profile.neighborhood}</p>
        </div>
      </div>
    </div>
  )
}
