import React, { useState, useEffect } from 'react';
import { CrownOutlined, ShoppingOutlined, StarOutlined } from '@ant-design/icons';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/v1/api/products/featured?limit=8');
      const data = await response.json();
      
      if (data.EC === 0) {
        setFeaturedProducts(data.DT.products);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <CrownOutlined /> Chào mừng đến với cửa hàng trực tuyến
          </h1>
          <p className="hero-description">
            Khám phá các sản phẩm chất lượng cao với giá cả hợp lý. 
            Từ điện tử, thời trang đến sách vở và đồ gia dụng.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="cta-button primary">
              <ShoppingOutlined /> Xem sản phẩm
            </Link>
            <Link to="/register" className="cta-button secondary">
              Đăng ký ngay
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
            alt="Online Shopping"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <ShoppingOutlined />
              </div>
              <h3>Sản phẩm đa dạng</h3>
              <p>Hàng nghìn sản phẩm từ các thương hiệu uy tín</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <StarOutlined />
              </div>
              <h3>Chất lượng cao</h3>
              <p>Cam kết chất lượng sản phẩm và dịch vụ tốt nhất</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CrownOutlined />
              </div>
              <h3>Giao hàng nhanh</h3>
              <p>Giao hàng miễn phí trong nội thành, hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link to="/products" className="view-all-link">
              Xem tất cả <ShoppingOutlined />
            </Link>
          </div>
          
          {loading ? (
            <LoadingSpinner size="large" text="Đang tải sản phẩm..." />
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng mua sắm?</h2>
            <p>Khám phá hàng nghìn sản phẩm chất lượng cao ngay hôm nay</p>
            <Link to="/products" className="cta-button primary large">
              <ShoppingOutlined /> Bắt đầu mua sắm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

