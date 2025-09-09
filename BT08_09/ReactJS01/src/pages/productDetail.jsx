import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductDetail.css';
import { getProductByIdApi, updateViewCountApi } from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    const hasIncrementedView = useRef(false);

    useEffect(() => {
        fetchProduct();
        // tăng lượt xem khi mở trang chi tiết (chặn gọi 2 lần do React StrictMode)
        if (!hasIncrementedView.current) {
            updateViewCountApi(id).catch(() => {});
            hasIncrementedView.current = true;
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await getProductByIdApi(id);
            if (response.EC === 0) {
                setProduct(response.DT);
            } else {
                setError(response.EM);
            }
        } catch (err) {
            setError('Lỗi khi tải sản phẩm');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!reviewForm.comment.trim()) {
            alert('Vui lòng nhập đánh giá');
            return;
        }

        try {
            setSubmittingReview(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:8080/v1/api/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewForm)
            });

            const data = await response.json();

            if (data.EC === 0) {
                alert('Đánh giá thành công!');
                setReviewForm({ rating: 5, comment: '' });
                fetchProduct(); // Reload product to show new review
            } else {
                alert(data.EM);
            }
        } catch (err) {
            alert('Lỗi khi gửi đánh giá');
            console.error('Error submitting review:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

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

    if (loading) {
        return <LoadingSpinner size="large" text="Đang tải sản phẩm..." />;
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Lỗi</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/products')} className="back-btn">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="error-container">
                <h2>Không tìm thấy sản phẩm</h2>
                <button onClick={() => navigate('/products')} className="back-btn">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                <div className="product-images">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                        }}
                    />
                </div>

                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    
                    <div className="product-rating">
                        <div className="stars">
                            {renderStars(product.rating)}
                        </div>
                        <span className="rating-text">
                            {product.rating.toFixed(1)} ({product.reviews?.length || 0} đánh giá)
                        </span>
                    </div>

                    <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                    </div>

                    <div className="product-description">
                        <h3>Mô tả sản phẩm</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-meta">
                        <div className="meta-item">
                            <strong>Danh mục:</strong>
                            <span className="category">{product.category}</span>
                        </div>
                        <div className="meta-item">
                            <strong>Tình trạng:</strong>
                            <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                        {product.stock > 0 && (
                            <div className="meta-item">
                                <strong>Số lượng còn lại:</strong>
                                <span>{product.stock} sản phẩm</span>
                            </div>
                        )}
                    </div>

                    <div className="product-actions">
                        <button 
                            className="add-to-cart-btn"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </button>
                        <button className="buy-now-btn" disabled={product.stock === 0}>
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            <div className="product-reviews">
                <h2>Đánh giá sản phẩm</h2>
                
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="reviews-list">
                        {product.reviews.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <strong>{review.user?.name || 'Người dùng'}</strong>
                                        <div className="review-stars">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <span className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-reviews">Chưa có đánh giá nào cho sản phẩm này.</p>
                )}

                <div className="review-form">
                    <h3>Viết đánh giá</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <div className="form-group">
                            <label>Đánh giá của bạn:</label>
                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
                                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="comment">Nhận xét:</label>
                            <textarea
                                id="comment"
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                rows="4"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="submit-review-btn"
                            disabled={submittingReview}
                        >
                            {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
