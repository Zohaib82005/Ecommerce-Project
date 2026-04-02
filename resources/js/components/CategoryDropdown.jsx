import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock brands data
  const topBrands = [
    { id: 1, name: 'Cooler Master', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=CoolerMaster' },
    { id: 2, name: 'Noble Chairs', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=NobleChairs' },
    { id: 3, name: 'GamerTek', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=GamerTek' },
    { id: 4, name: 'X Rocker', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=XRocker' },
    { id: 5, name: 'Pit Bull Racing', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=PitBull' },
    { id: 6, name: 'Max Strength', logo: 'https://via.placeholder.com/100x60/ffffff/333333?text=MaxStrength' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const activeTab = categories.find(cat => cat.id === activeCategory);

  const getCategoryImage = (subcategory) => {
    // Check for direct image field on subcategory
    if (subcategory.image) {
      return subcategory.image;
    }
    // Fallback to images array
    if (subcategory.images && subcategory.images.length > 0) {
      return subcategory.images[0].url;
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setActiveSubcategory(null);
        }}
        className="flex items-center gap-2 px-4  rounded-lg bg-indigo-750 transition-all duration-200 text-white font-semibold  text-sm"
      >
        {/* Grid icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <span>Category</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setActiveSubcategory(null);
            }}
          />

          {/* Dropdown Panel */}
          <div
            className="absolute left-0 top-full mt-1 z-50 bg-white rounded-b-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{ width: '900px', maxWidth: 'calc(100vw - 2rem)' }}
          >
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">Loading categories...</p>
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center p-16 text-gray-400">
                <p className="text-sm">No categories available yet</p>
              </div>
            ) : (
              <div className="flex" style={{ minHeight: '400px' }}>

                {/* ── Left Sidebar ── */}
                <div
                  className="flex-shrink-0 border-r border-gray-200 p-2 bg-white overflow-y-auto"
                  style={{ width: '220px' }}
                >
                  {categories.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category.id)}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setActiveSubcategory(null);
                        }}
                        className={`w-full text-left flex items-center justify-between px-4 py-2 text-sm transition-colors duration-150 border-l-4 ${
                          isActive
                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                            : 'border-transparent text-gray-700 hover:bg-gray-50 font-normal'
                        }`}
                      >
                        <span className="truncate">{category.category}</span>
                        <svg
                          className={`w-4 h-4 flex-shrink-0 ml-2 ${isActive ? 'text-purple-600' : 'text-gray-400'}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                {/* ── Main Content ── */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  {activeTab ? (
                    <div className="space-y-6">

                      {/* Shop by Category */}
                      <div>
                        <h3 className="text-base font-bold text-black mb-4">Shop by Category</h3>
                        <div className="grid grid-cols-6 gap-3">
                          {activeTab.subcategories && activeTab.subcategories.slice(0, 6).map((subcategory, idx) => {
                            const imgSrc = getCategoryImage(subcategory);
                            return (
                              <Link
                                key={subcategory.id}
                                href={`/category/${subcategory.id}`}
                                className="flex flex-col items-center gap-2 group"
                              >
                                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:bg-purple-50 transition-colors">
                                  {imgSrc ? (
                                    <img
                                      src={`/storage/${imgSrc}`}
                                      alt={subcategory.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-2xl">📦</span>
                                  )}
                                </div>
                                <span
                                  className={`text-xs text-center leading-tight transition-colors font-bold ${
                                    idx === 0
                                      ? 'text-black'
                                      : 'text-black group-hover:text-purple-700'
                                  }`}
                                >
                                  {subcategory.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Sub-Category + Top Brands side by side */}
                      {activeTab.subcategories && activeTab.subcategories.length > 0 && (
                        <div className="flex gap-8 pt-2">

                          {/* Shop by Sub-Sub Category */}
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-black mb-3">Shop by Sub-Category</h3>
                            <div className="grid grid-cols-2 gap-3">
                              {activeTab.subcategories.slice(0, 12).map((subcategory) => {
                                // Get all sub-sub categories for this subcategory
                                if (subcategory.sub_subcategories && subcategory.sub_subcategories.length > 0) {
                                  return subcategory.sub_subcategories.map((subSubcategory) => (
                                    <Link
                                      key={subSubcategory.id}
                                      href={`/product/${subSubcategory.id}`}
                                      className="block text-sm text-black font-semibold hover:text-purple-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                                    >
                                      {subSubcategory.name}
                                    </Link>
                                  ));
                                }
                                return null;
                              }).flat()}
                            </div>
                          </div>

                          {/* Top Brands */}
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-black mb-3">Top Brands</h3>
                            <div className="grid grid-cols-3 gap-3">
                              {topBrands.map((brand) => (
                                <div
                                  key={brand.id}
                                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
                                  style={{ minHeight: '64px' }}
                                >
                                  <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-8 w-auto object-contain"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Select a category to view details</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDropdown;