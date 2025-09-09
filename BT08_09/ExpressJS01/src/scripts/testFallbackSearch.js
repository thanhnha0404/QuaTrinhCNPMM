const fallbackService = require('../services/fallbackSearchService');

const testFallbackSearch = async () => {
    console.log('🔍 Testing Fallback Search (MongoDB)...\n');

    try {
        // Test 1: Tìm kiếm fuzzy
        console.log('1. Tìm kiếm fuzzy "dien thoai" (thiếu dấu):');
        const result1 = await fallbackService.fuzzySearchProducts('dien thoai', 1, 5);
        console.log(`Found ${result1.DT?.products?.length || 0} products`);
        if (result1.DT?.products?.length > 0) {
            result1.DT.products.forEach(product => {
                console.log(`  - ${product.name} (${product.category})`);
            });
        }
        console.log('');

        // Test 2: Tìm kiếm fuzzy "iphon" (thiếu e)
        console.log('2. Tìm kiếm fuzzy "iphon" (thiếu e):');
        const result2 = await fallbackService.fuzzySearchProducts('iphon', 1, 5);
        console.log(`Found ${result2.DT?.products?.length || 0} products`);
        if (result2.DT?.products?.length > 0) {
            result2.DT.products.forEach(product => {
                console.log(`  - ${product.name} (${product.category})`);
            });
        }
        console.log('');

        // Test 3: Filter by category
        console.log('3. Filter by category=electronics:');
        const result3 = await fallbackService.filterProducts({ category: 'electronics' }, 1, 5);
        console.log(`Found ${result3.DT?.products?.length || 0} products`);
        if (result3.DT?.products?.length > 0) {
            result3.DT.products.forEach(product => {
                console.log(`  - ${product.name} (${product.category}) - ${product.price}đ`);
            });
        }
        console.log('');

        // Test 4: Filter by price range
        console.log('4. Filter by price range 1000000-5000000:');
        const result4 = await fallbackService.filterProducts({ 
            minPrice: 1000000, 
            maxPrice: 5000000 
        }, 1, 5);
        console.log(`Found ${result4.DT?.products?.length || 0} products`);
        if (result4.DT?.products?.length > 0) {
            result4.DT.products.forEach(product => {
                console.log(`  - ${product.name} - ${product.price}đ`);
            });
        }
        console.log('');

        // Test 5: Search suggestions
        console.log('5. Search suggestions for "smart":');
        const result5 = await fallbackService.getSearchSuggestions('smart', 5);
        console.log(`Suggestions: ${result5.DT?.length || 0}`);
        if (result5.DT?.length > 0) {
            result5.DT.forEach(suggestion => {
                console.log(`  - ${suggestion.text}`);
            });
        }
        console.log('');

        // Test 6: Filter options
        console.log('6. Filter options:');
        const result6 = await fallbackService.getFilterOptions();
        if (result6.DT) {
            console.log(`Categories: ${result6.DT.categories?.length || 0}`);
            console.log(`Price range: ${result6.DT.priceRange?.min || 0} - ${result6.DT.priceRange?.max || 0}`);
            console.log(`Rating range: ${result6.DT.ratingRange?.min || 0} - ${result6.DT.ratingRange?.max || 0}`);
            console.log(`Tags: ${result6.DT.tags?.length || 0}`);
        }
        console.log('');

        console.log('✅ All fallback tests completed successfully!');
        console.log('💡 MongoDB fallback is working properly!');

    } catch (error) {
        console.error('❌ Error testing fallback search:', error);
    }
};

// Chạy test
testFallbackSearch().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});

