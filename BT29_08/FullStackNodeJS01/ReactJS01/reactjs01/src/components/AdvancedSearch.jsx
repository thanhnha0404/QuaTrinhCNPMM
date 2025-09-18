import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions based on common search terms
  const mockSuggestions = [
    'iPhone', 'Samsung Galaxy', 'MacBook', 'Dell Laptop', 'Nike Shoes',
    'Adidas', 'Nike Air', 'Sony Headphones', 'Canon Camera', 'Nikon',
    'Gaming Mouse', 'Mechanical Keyboard', 'Monitor 4K', 'SSD 1TB',
    'RAM 16GB', 'Graphics Card', 'Motherboard', 'Power Supply'
  ];

  // Filter suggestions based on input
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/v1/api/products/search?q=${encodeURIComponent(query)}&limit=10`);
      
      if (response.data.EC === 0) {
        setResults(response.data.DT.products);
        
        // Add to search history
        if (!searchHistory.includes(query)) {
          setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to MongoDB search
      try {
        const response = await axios.get(`http://localhost:8080/v1/api/products/search-mongodb?q=${encodeURIComponent(query)}&limit=10`);
        if (response.data.EC === 0) {
          setResults(response.data.DT.products);
        }
      } catch (fallbackError) {
        console.error('MongoDB search also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    handleSearch(historyItem);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const navigate = useNavigate();

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        🔍 Fuzzy Search Demo
      </h2>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Nhập từ khóa tìm kiếm (hỗ trợ fuzzy search)..."
          style={{
            width: '100%',
            padding: '15px 20px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '0 0 15px 15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                🔍 {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={() => handleSearch()}
          disabled={loading || !searchQuery.trim()}
          style={{
            padding: '15px 40px',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '⏳ Đang tìm kiếm...' : '🚀 Tìm kiếm'}
        </button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h4 style={{ color: 'white', margin: 0 }}>📚 Lịch sử tìm kiếm:</h4>
            <button
              onClick={clearHistory}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️ Xóa
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ 
            color: '#333', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🎯 Kết quả tìm kiếm ({results.length} sản phẩm)
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {results.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  padding: '15px',
                  background: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h4 style={{ 
                  margin: '0 0 10px 0', 
                  color: '#333',
                  fontSize: '16px'
                }}>
                  {product.name}
                </h4>
                
                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginRight: '5px'
                  }}>
                    {product.category}
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  {product.discount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <span style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '12px'
                      }}>
                        {product.originalPrice?.toLocaleString()} VND
                      </span>
                      <span style={{
                        background: '#dc3545',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    {product.price?.toLocaleString()} VND
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>👁️ {product.viewCount || 0}</span>
                  <span style={{
                    color: product.inStock ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    {product.inStock ? '✅ Còn hàng' : '❌ Hết hàng'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery && results.length === 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            😔 Không tìm thấy sản phẩm nào
          </h3>
          <p style={{ color: '#999' }}>
            Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
