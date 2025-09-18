import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const FavoritesContext = createContext({
  favoriteIds: [],
  toggleFavorite: (id) => {},
  isFavorite: (id) => false,
  clearFavorites: () => {},
})

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const raw = localStorage.getItem('favorite_product_ids')
      return raw ? JSON.parse(raw) : []
    } catch (_) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('favorite_product_ids', JSON.stringify(favoriteIds))
    } catch (_) {}
  }, [favoriteIds])

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return [...prev, id]
    })
  }, [])

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds])

  const clearFavorites = useCallback(() => setFavoriteIds([]), [])

  const value = useMemo(
    () => ({ favoriteIds, toggleFavorite, isFavorite, clearFavorites }),
    [favoriteIds, toggleFavorite, isFavorite, clearFavorites]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}


