import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FavoritesContext } from '../components/context/favorites.context.jsx'

const FavoritesPage = () => {
  const { favoriteIds, toggleFavorite, isFavorite, clearFavorites } = useContext(FavoritesContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favoriteIds.length === 0) {
        setProducts([])
        return
      }
      setLoading(true)
      try {
        // Reuse search endpoint by ids filter if supported, otherwise fetch individually
        const res = await axios.get(`http://localhost:8080/v1/api/products/search-mongodb?ids=${favoriteIds.join(',')}&limit=${favoriteIds.length}`)
        if (res?.data?.DT?.products) {
          setProducts(res.data.DT.products)
        } else {
          setProducts([])
        }
      } catch (_) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [favoriteIds])

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>❤️ Sản phẩm yêu thích ({favoriteIds.length})</h2>
        {favoriteIds.length > 0 && (
          <button onClick={clearFavorites} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>
            Xóa tất cả
          </button>
        )}
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : products.length === 0 ? (
        <p>Chưa có sản phẩm yêu thích.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: '1px solid #e9ecef', borderRadius: 12, padding: 16, background: 'white', cursor: 'pointer' }} onClick={() => navigate(`/products/${p._id}`)}>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(p._id) }}
                aria-label="Yêu thích"
                title={isFavorite(p._id) ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 20,
                  background: 'transparent',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
              >
                {isFavorite(p._id) ? '❤️' : '🤍'}
              </button>
              {p.image && (
                <img src={p.image} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
              )}
              <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
              <div style={{ color: '#007bff', fontWeight: 'bold', marginBottom: 6 }}>
                {p.price?.toLocaleString()} VND
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>👁️ {p.viewCount || 0} | {p.inStock ? '✅ Còn hàng' : '❌ Hết hàng'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage


