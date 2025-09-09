import React, { useState, useEffect, useCallback } from 'react';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { 
  fuzzySearchApi, 
  getSearchSuggestionsApi, 
  getFilterOptionsApi 
} from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import './AdvancedSearch.css';

const AdvancedSearch = ({ onSearchResults, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    minDiscount: '',
    minViewCount: '',
    inStock: false,
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Load filter options khi component mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load suggestions khi search term thay đổi
  useEffect(() => {
    if (searchTerm.length > 1) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptionsApi();
      if (response.EC === 0) {
        setFilterOptions(response.DT);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadSuggestions = useCallback(async () => {
    try {
      const response = await getSearchSuggestionsApi(searchTerm, 5);
      if (response.EC === 0) {
        setSuggestions(response.DT);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  }, [searchTerm]);

  // Hàm chuyển đổi tên danh mục sang tiếng Việt
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'electronics': 'Điện tử',
      'clothing': 'Thời trang',
      'books': 'Sách',
      'home': 'Gia dụng',
      'sports': 'Thể thao',
      'beauty': 'Làm đẹp',
      'toys': 'Đồ chơi',
      'food': 'Thực phẩm'
    };
    return categoryNames[category] || category;
  };

  const handleSearch = async (searchQuery = searchTerm) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchParams = {
        q: searchQuery,
        page: 1,
        limit: 20,
        ...filters
      };

      // Loại bỏ các filter rỗng
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === '' || searchParams[key] === false) {
          delete searchParams[key];
        }
      });

      console.log('Searching with params:', searchParams);
      const response = await fuzzySearchApi(searchQuery, searchParams);
      console.log('Search response:', response);
      
      if (response.EC === 0) {
        setSearchResults(response.DT);
        onSearchResults?.(response.DT);
        onFilterChange?.(filters); // Gửi filters để ProductList có thể áp dụng
        setShowSuggestions(false);
      } else {
        console.error('Search error:', response.EM);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      minDiscount: '',
      minViewCount: '',
      inStock: false,
      tags: []
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="advanced-search">
      {/* Search Input */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Tìm kiếm sản phẩm với Fuzzy Search..."
            className="search-input"
          />
          <button
            onClick={() => handleSearch()}
            className="search-button"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Tìm kiếm'}
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <SearchOutlined className="suggestion-icon" />
                <span>{suggestion.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="filter-toggle">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
        >
          <FilterOutlined /> Bộ lọc nâng cao
        </button>
        {Object.values(filters).some(value => 
          value !== '' && value !== false && (Array.isArray(value) ? value.length > 0 : true)
        ) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            <ClearOutlined /> Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Danh mục</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả danh mục</option>
                {filterOptions.categories?.map(category => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Khoảng giá</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label>Đánh giá tối thiểu</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="4">4+ sao</option>
                <option value="3">3+ sao</option>
                <option value="2">2+ sao</option>
                <option value="1">1+ sao</option>
              </select>
            </div>

            {/* Discount Filter */}
            <div className="filter-group">
              <label>Khuyến mãi tối thiểu</label>
              <select
                value={filters.minDiscount}
                onChange={(e) => handleFilterChange('minDiscount', e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="50">50% trở lên</option>
                <option value="30">30% trở lên</option>
                <option value="20">20% trở lên</option>
                <option value="10">10% trở lên</option>
              </select>
            </div>

            {/* View Count Filter */}
            <div className="filter-group">
              <label>Lượt xem tối thiểu</label>
              <input
                type="number"
                placeholder="Ví dụ: 500"
                value={filters.minViewCount}
                onChange={(e) => handleFilterChange('minViewCount', e.target.value)}
                className="price-input"
                min="0"
              />
            </div>

            {/* Stock Filter */}
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="filter-checkbox"
                />
                Chỉ sản phẩm còn hàng
              </label>
            </div>
          </div>

          {/* Auto apply on change: nút áp dụng đã được loại bỏ */}
        </div>
      )}

      {/* Search Results Summary */}
      {searchResults && (
        <div className="search-results-summary">
          <p>
            Tìm thấy <strong>{searchResults.pagination.totalItems}</strong> sản phẩm
            {searchTerm && ` cho "${searchTerm}"`}
            {filters.category && filters.category !== '' && ` trong danh mục "${getCategoryDisplayName(filters.category)}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
