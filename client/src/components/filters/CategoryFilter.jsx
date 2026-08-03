
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
            selectedCategory === category.slug
              ? 'bg-orange-100 text-orange-700 border border-orange-300'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
