import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { getProductsApi, filterProductsApi } from '../../utils/api';
import './ProductList.css';

const ProductList = ({ 
    category = null, 
    searchTerm = null, 
    showFilters = true,
    itemsPerPage = 12,
    searchResults = null,
    filters = {}
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(category || 'all');
    const [search, setSearch] = useState(searchTerm || '');

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

    // Fetch products
    const fetchProducts = useCallback(async (page = 1, reset = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);


            const paramsObj = {
                page: page.toString(),
                limit: itemsPerPage.toString()
            };

            if (selectedCategory && selectedCategory !== 'all') {
                paramsObj.category = selectedCategory;
            }

            if (search) {
                paramsObj.search = search;
            }

            const response = await getProductsApi(paramsObj);

            if (response.EC === 0) {
                const newProducts = response.DT.products;
                
                if (reset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }
                
                setHasMore(response.DT.pagination.hasNextPage);
                setCurrentPage(page);
            } else {
                setError(response.EM);
            }
        } catch (err) {
            setError('Lỗi khi tải sản phẩm');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory, search, itemsPerPage]);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/v1/api/products/categories');
            const data = await response.json();
            
            if (data.EC === 0) {
                setCategories(data.DT);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Load more products
    const loadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, false);
        }
    };

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setProducts([]);
        fetchProducts(1, true);
    };

    // Handle search
    const handleSearch = (searchTerm) => {
        setSearch(searchTerm);
        setCurrentPage(1);
        setProducts([]);
        fetchProducts(1, true);
    };

    // Apply filters from AdvancedSearch
    const applyFilters = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build params and clean empty values
            const paramsObj = {
                page: 1,
                limit: itemsPerPage.toString(),
                ...filters,
            };
            Object.keys(paramsObj).forEach((key) => {
                const val = paramsObj[key];
                if (val === '' || val === undefined || val === null) {
                    delete paramsObj[key];
                }
            });
            if (paramsObj.minPrice !== undefined) paramsObj.minPrice = Number(paramsObj.minPrice);
            if (paramsObj.maxPrice !== undefined) paramsObj.maxPrice = Number(paramsObj.maxPrice);
            if (paramsObj.minRating !== undefined) paramsObj.minRating = Number(paramsObj.minRating);
            if (paramsObj.minDiscount !== undefined) paramsObj.minDiscount = Number(paramsObj.minDiscount);

            const response = await filterProductsApi(paramsObj);

            if (response.EC === 0) {
                setProducts(response.DT.products);
                setHasMore(response.DT.pagination.hasNextPage);
                setCurrentPage(1);
            } else {
                setError(response.EM);
            }
        } catch (err) {
            setError('Lỗi khi áp dụng bộ lọc');
            console.error('Error applying filters:', err);
        } finally {
            setLoading(false);
        }
    };

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, currentPage]);

    // Handle search results from AdvancedSearch
    useEffect(() => {
        if (searchResults) {
            setProducts(searchResults.products);
            setHasMore(searchResults.pagination.hasNextPage);
            setCurrentPage(searchResults.pagination.currentPage);
            setLoading(false);
        }
    }, [searchResults]);

    // Handle filters from AdvancedSearch
    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            // Apply filters and search
            applyFilters();
        }
    }, [filters]);

    // Initial load
    useEffect(() => {
        if (!searchResults) {
            fetchProducts(1, true);
            fetchCategories();
        }
    }, [searchResults]);

    // Reset when category or search changes
    useEffect(() => {
        if (category !== selectedCategory || searchTerm !== search) {
            setSelectedCategory(category || 'all');
            setSearch(searchTerm || '');
            setCurrentPage(1);
            setProducts([]);
            fetchProducts(1, true);
        }
    }, [category, searchTerm]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Lỗi khi tải sản phẩm</h3>
                <p>{error}</p>
                <button onClick={() => fetchProducts(1, true)} className="retry-btn">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            {showFilters && (
                <div className="product-filters">
                    
                    <div className="category-filters">
                        <button
                            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat)}
                            >
                                {getCategoryDisplayName(cat)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="no-products">
                        <h3>Không tìm thấy sản phẩm nào</h3>
                        <p>Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                    </div>
                )}
            </div>

            {loadingMore && (
                <div className="loading-more">
                    <LoadingSpinner />
                    <p>Đang tải thêm sản phẩm...</p>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <div className="no-more-products">
                    <p>Đã hiển thị tất cả sản phẩm</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
