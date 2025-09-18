import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../components/context/auth.context.jsx'
import { FavoritesContext } from '../components/context/favorites.context.jsx'

const loadReviews = (productId) => {
  try {
    const raw = localStorage.getItem(`product_reviews_${productId}`)
    return raw ? JSON.parse(raw) : []
  } catch (_) {
    return []
  }
}

const saveReviews = (productId, reviews) => {
  try {
    localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(reviews))
  } catch (_) {}
}

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [related, setRelated] = useState([])

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setReviews(loadReviews(id))
  }, [id])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError('')
      try {
        let detail = null
        try {
          const res = await axios.get(`http://localhost:8080/v1/api/products/${id}`)
          detail = res?.data?.DT || res?.data || null
        } catch (_) {
          // fallback: search-mongodb by id
          const res = await axios.get(`http://localhost:8080/v1/api/products/search-mongodb?ids=${id}&limit=1`)
          detail = res?.data?.DT?.products?.[0] || null
        }
        if (!detail) throw new Error('Không tìm thấy sản phẩm')
        setProduct(detail)
        // fetch related by category
        if (detail.category) {
          try {
            const rel = await axios.get(
              `http://localhost:8080/v1/api/products/search-mongodb?category=${encodeURIComponent(detail.category)}&limit=8`
            )
            const relList = rel?.data?.DT?.products?.filter((p) => p._id !== detail._id) || []
            setRelated(relList)
          } catch (_) {
            setRelated([])
          }
        } else {
          setRelated([])
        }
      } catch (e) {
        setError(e?.message || 'Lỗi tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddReview = (e) => {
    e.preventDefault()
    if (!auth?.isAuthenticated) return
    const newReview = {
      id: `${Date.now()}`,
      user: auth?.user?.email || 'Người dùng',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    }
    const next = [newReview, ...reviews]
    setReviews(next)
    saveReviews(id, next)
    setComment('')
    setRating(5)
  }

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>
  if (!product) return null

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24, alignItems: 'start' }}>
        <div>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
            />
          )}
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <div style={{ margin: '8px 0 16px 0', color: '#666' }}>Danh mục: {product.category}</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: '#007bff', marginBottom: 12 }}>
            {product.price?.toLocaleString()} VND
          </div>
          {product.discount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ textDecoration: 'line-through', color: '#999' }}>
                {product.originalPrice?.toLocaleString()} VND
              </span>
              <span style={{ background: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
                -{product.discount}%
              </span>
            </div>
          )}
          <div style={{ marginBottom: 16, color: product.inStock ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {product.inStock ? '✅ Còn hàng' : '❌ Hết hàng'}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => toggleFavorite(product._id)}
              style={{ padding: '10px 14px', border: '1px solid #eee', borderRadius: 8, cursor: 'pointer', background: 'white' }}
            >
              {isFavorite(product._id) ? '❤️ Bỏ yêu thích' : '🤍 Yêu thích'}
            </button>
            <button
              onClick={() => {}}
              style={{ padding: '10px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', background: '#28a745', color: 'white', fontWeight: 'bold' }}
            >
              🛒 Đặt hàng
            </button>
          </div>

          {product.description && (
            <p style={{ lineHeight: 1.6 }}>{product.description}</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Đánh giá</h2>
        {auth?.isAuthenticated ? (
          <form onSubmit={handleAddReview} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}>
              <option value={5}>⭐️⭐️⭐️⭐️⭐️</option>
              <option value={4}>⭐️⭐️⭐️⭐️</option>
              <option value={3}>⭐️⭐️⭐️</option>
              <option value={2}>⭐️⭐️</option>
              <option value={1}>⭐️</option>
            </select>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Viết cảm nhận của bạn..." style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            <button type="submit" disabled={!comment.trim()} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>Gửi đánh giá</button>
          </form>
        ) : (
          <div style={{ marginBottom: 16, color: '#666' }}>Vui lòng đăng nhập để đánh giá.</div>
        )}

        {reviews.length === 0 ? (
          <div>Chưa có đánh giá nào.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong>{r.user}</strong>
                  <span>{'⭐'.repeat(r.rating)}</span>
                </div>
                <div style={{ color: '#555' }}>{r.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 40 }}>
        <h2>Sản phẩm cùng danh mục</h2>
        {related.length === 0 ? (
          <div>Không có sản phẩm liên quan.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {related.map((p) => (
              <div
                key={p._id}
                style={{ border: '1px solid #e9ecef', borderRadius: 12, padding: 16, background: 'white', cursor: 'pointer' }}
                onClick={() => navigate(`/products/${p._id}`)}
              >
                {p.image && (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                )}
                <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{p.name}</div>
                <div style={{ color: '#007bff', fontWeight: 'bold' }}>{p.price?.toLocaleString()} VND</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage


