import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { FavoritesContext } from "../components/context/favorites.context.jsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minDiscount: "",
    maxDiscount: "",
    minViews: "",
    maxViews: "",
    inStock: "true", // Mặc định chỉ hiển thị sản phẩm còn hàng
    sortBy: "",
    sortOrder: "desc"
  });
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/api/categories");
      setCategories(res.data.DT);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Search products with filters
  const searchProducts = async (resetPage = true) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });
      
      if (searchQuery.trim()) {
        params.append('q', searchQuery);
      }

      const res = await axios.get(`http://localhost:8080/v1/api/products/search?${params}`);
      const newProducts = res.data.DT.products;
      console.log(`🔍 API Response: ${newProducts.length} products, Total: ${res.data.DT.total}`);

      if (resetPage) {
        setProducts(newProducts);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(page + 1);
      }

      setTotal(res.data.DT.total);
      setHasMore(newProducts.length === 12 && (resetPage ? newProducts.length : products.length + newProducts.length) < res.data.DT.total);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to MongoDB search
      try {
        const currentPage = resetPage ? 1 : page;
        const params = new URLSearchParams({
          page: currentPage,
          limit: 12,
          ...filters
        });
        
        if (searchQuery.trim()) {
          params.append('q', searchQuery);
        }

        const res = await axios.get(`http://localhost:8080/v1/api/products/search-mongodb?${params}`);
        const newProducts = res.data.DT.products;
        console.log(`🔍 MongoDB API Response: ${newProducts.length} products, Total: ${res.data.DT.total}`);

        if (resetPage) {
          setProducts(newProducts);
          setPage(2);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
          setPage(page + 1);
        }

        setTotal(res.data.DT.total);
        setHasMore(newProducts.length === 12 && (resetPage ? newProducts.length : products.length + newProducts.length) < res.data.DT.total);
      } catch (fallbackError) {
        console.error("MongoDB search also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load more products
  const loadMore = () => {
    if (!loading && hasMore) {
      searchProducts(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(true);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      minDiscount: "",
      maxDiscount: "",
      minViews: "",
      maxViews: "",
      inStock: "true", // Reset về chỉ hiển thị sản phẩm còn hàng
      sortBy: "",
      sortOrder: "desc"
    });
    setSearchQuery("");
  };

  // Auto search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(true);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    fetchCategories();
    searchProducts(true);
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        🏠 Trang chủ - Tìm kiếm sản phẩm với Fuzzy Search
      </h1>
      
      {/* Search Bar */}
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        padding: "30px", 
        borderRadius: "15px", 
        marginBottom: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm (hỗ trợ fuzzy search)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                padding: "15px 20px", 
                border: "none", 
                borderRadius: "25px",
                fontSize: "16px",
                outline: "none",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: "15px 30px", 
                background: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "25px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
              }}
            >
              {loading ? "⏳ Đang tìm..." : "🚀 Tìm kiếm"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              style={{ 
                padding: "15px 20px", 
                background: "#17a2b8", 
                color: "white", 
                border: "none", 
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
              }}
            >
              {showFilters ? "📋 Ẩn bộ lọc" : "🔧 Bộ lọc"}
            </button>
            <button 
              type="button" 
              onClick={clearFilters}
              style={{ 
                padding: "15px 20px", 
                background: "#dc3545", 
                color: "white", 
                border: "none", 
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
              }}
            >
              🗑️ Xóa bộ lọc
            </button>
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p style={{ textAlign: "center" }}>⏳ Đang tải thêm...</p>}
        endMessage={
          <div style={{ textAlign: "center", padding: "20px", color: "#28a745" }}>
            <h3>🎉 Đã tải hết sản phẩm!</h3>
            <p>Cảm ơn bạn đã sử dụng hệ thống tìm kiếm của chúng tôi</p>
          </div>
        }
      >
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "25px" 
        }}>
          {products.map((p) => (
            <div 
              key={p._id} 
              style={{ 
                border: "1px solid #e9ecef", 
                borderRadius: "15px", 
                padding: "20px", 
                background: "white",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={() => navigate(`/products/${p._id}`)}  // 👉 thêm navigate ở đây
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.08)";
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(p._id); }}
                aria-label="Yêu thích"
                title={isFavorite(p._id) ? "Bỏ yêu thích" : "Thêm yêu thích"}
                style={{
                  position: "absolute",
                  right: 20,
                  top: 20,
                  background: "transparent",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                {isFavorite(p._id) ? "❤️" : "🤍"}
              </button>
              {p.image && (
                <img 
                  src={p.image} 
                  alt={p.name} 
                  style={{ 
                    width: "100%", 
                    height: "200px", 
                    objectFit: "cover", 
                    borderRadius: "10px",
                    marginBottom: "15px"
                  }} 
                />
              )}
              <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#333" }}>
                {p.name}
              </h3>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {p.description?.substring(0, 120)}...
              </p>
              <div style={{ fontWeight: "bold", color: "#007bff" }}>
                {p.price?.toLocaleString()} VND
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
