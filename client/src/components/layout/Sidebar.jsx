import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../../data/mockData";
import { PRICE_PRESETS } from "../../utils/constants";
import CategoryFilter from "../../components/filters/CategoryFilter";
import PriceFilter from "../../components/filters/PriceFilter";

export default function Sidebar({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onClear,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-28 h-[calc(100vh-7rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 transform transition-transform lg:relative lg:top-0 lg:h-auto lg:transform-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4">
          {/* Close Button (Mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>

          {/* Categories */}
          <div className="mb-6 mt-8 lg:mt-0">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
              Categories
            </h3>
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelect={onCategoryChange}
            />
          </div>

          {/* Price Filter */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
              Price
            </h3>
            <PriceFilter
              priceRange={priceRange}
              onPriceChange={onPriceChange}
              presets={PRICE_PRESETS}
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={onClear}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Clear Filters
          </button>
        </div>
      </aside>
    </>
  );
}
