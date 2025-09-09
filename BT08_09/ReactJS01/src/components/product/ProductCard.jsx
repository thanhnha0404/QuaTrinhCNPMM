import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
        }

        return stars;
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                <div className="product-overlay">
                    <Link to={`/products/${product._id}`} className="view-details-btn">
                        Xem chi tiết
                    </Link>
                </div>
            </div>
            
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-rating">
                    <div className="stars">
                        {renderStars(product.rating)}
                    </div>
                    <span className="rating-text">
                        ({product.reviews?.length || 0} đánh giá)
                    </span>
                </div>
                
                <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.discount > 0 && (
                        <span className="discount">-{product.discount}%</span>
                    )}
                </div>
                
                <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                    <span className="view-count">{product.viewCount || 0} lượt xem</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;







