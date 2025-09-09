import React, { useState } from 'react';
import ProductList from '../components/product/ProductList';
import AdvancedSearch from '../components/search/AdvancedSearch';
import './Products.css';

const Products = () => {
    const [searchResults, setSearchResults] = useState(null);
    const [filters, setFilters] = useState({});

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="products-page">
            <div className="page-header">
                <h1>Danh sách sản phẩm</h1>
                <p>Khám phá các sản phẩm chất lượng cao với giá cả hợp lý</p>
            </div>
            
            {/* Advanced Search Component */}
            <AdvancedSearch 
                onSearchResults={handleSearchResults}
                onFilterChange={handleFilterChange}
            />
            
            {/* Product List */}
            <ProductList 
                showFilters={true} 
                searchResults={searchResults}
                filters={filters}
            />
        </div>
    );
};

export default Products;




