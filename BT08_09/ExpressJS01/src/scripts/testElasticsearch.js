require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { 
    fuzzySearchProducts, 
    filterProducts, 
    getSearchSuggestions,
    getFilterOptions 
} = require('../services/elasticsearchService');

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expressjs01');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.log('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Test fuzzy search
const testFuzzySearch = async () => {
    console.log('\n🔍 Testing Fuzzy Search...');
    
    try {
        // Test 1: Tìm kiếm chính xác
        console.log('\n1. Tìm kiếm chính xác "iPhone":');
        const result1 = await fuzzySearchProducts('iPhone', 1, 5);
        console.log(`Found ${result1.DT?.pagination?.totalItems || 0} products`);
        if (result1.DT?.products?.length > 0) {
            console.log('First product:', result1.DT.products[0].name);
        }

        // Test 2: Tìm kiếm mờ (có lỗi chính tả)
        console.log('\n2. Tìm kiếm mờ "iphon" (thiếu e):');
        const result2 = await fuzzySearchProducts('iphon', 1, 5);
        console.log(`Found ${result2.DT?.pagination?.totalItems || 0} products`);

        // Test 3: Tìm kiếm với filter
        console.log('\n3. Tìm kiếm "phone" với filter category=electronics:');
        const result3 = await fuzzySearchProducts('phone', 1, 5, {
            category: 'electronics'
        });
        console.log(`Found ${result3.DT?.pagination?.totalItems || 0} products`);

        // Test 4: Tìm kiếm với nhiều filter
        console.log('\n4. Tìm kiếm "smart" với multiple filters:');
        const result4 = await fuzzySearchProducts('smart', 1, 5, {
            category: 'electronics',
            minPrice: 1000000,
            minRating: 4
        });
        console.log(`Found ${result4.DT?.pagination?.totalItems || 0} products`);

    } catch (error) {
        console.log('❌ Error in fuzzy search test:', error.message);
    }
};

// Test filter products
const testFilterProducts = async () => {
    console.log('\n🔧 Testing Filter Products...');
    
    try {
        // Test 1: Filter by category
        console.log('\n1. Filter by category=electronics:');
        const result1 = await filterProducts({
            category: 'electronics'
        }, 1, 5);
        console.log(`Found ${result1.DT?.pagination?.totalItems || 0} products`);

        // Test 2: Filter by price range
        console.log('\n2. Filter by price range 500000-2000000:');
        const result2 = await filterProducts({
            minPrice: 500000,
            maxPrice: 2000000
        }, 1, 5);
        console.log(`Found ${result2.DT?.pagination?.totalItems || 0} products`);

        // Test 3: Filter by rating
        console.log('\n3. Filter by minRating=4:');
        const result3 = await filterProducts({
            minRating: 4
        }, 1, 5);
        console.log(`Found ${result3.DT?.pagination?.totalItems || 0} products`);

        // Test 4: Complex filter
        console.log('\n4. Complex filter (category + price + rating):');
        const result4 = await filterProducts({
            category: 'electronics',
            minPrice: 1000000,
            maxPrice: 5000000,
            minRating: 4,
            inStock: true
        }, 1, 5, 'price', 'asc');
        console.log(`Found ${result4.DT?.pagination?.totalItems || 0} products`);

    } catch (error) {
        console.log('❌ Error in filter products test:', error.message);
    }
};

// Test search suggestions
const testSearchSuggestions = async () => {
    console.log('\n💡 Testing Search Suggestions...');
    
    try {
        // Test 1: Basic suggestions
        console.log('\n1. Suggestions for "iph":');
        const result1 = await getSearchSuggestions('iph', 5);
        console.log('Suggestions:', result1.DT?.map(s => s.text) || []);

        // Test 2: Suggestions for "smart"
        console.log('\n2. Suggestions for "smart":');
        const result2 = await getSearchSuggestions('smart', 3);
        console.log('Suggestions:', result2.DT?.map(s => s.text) || []);

    } catch (error) {
        console.log('❌ Error in search suggestions test:', error.message);
    }
};

// Test filter options
const testFilterOptions = async () => {
    console.log('\n📊 Testing Filter Options...');
    
    try {
        const result = await getFilterOptions();
        console.log('Filter options:', {
            categories: result.DT?.categories?.length || 0,
            priceRange: result.DT?.priceRange,
            ratingRange: result.DT?.ratingRange,
            discountRange: result.DT?.discountRange,
            tags: result.DT?.tags?.length || 0
        });

    } catch (error) {
        console.log('❌ Error in filter options test:', error.message);
    }
};

// Test performance
const testPerformance = async () => {
    console.log('\n⚡ Testing Performance...');
    
    try {
        const startTime = Date.now();
        
        // Test multiple searches
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(fuzzySearchProducts('phone', 1, 10));
        }
        
        await Promise.all(promises);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`10 concurrent searches completed in ${duration}ms`);
        console.log(`Average time per search: ${duration / 10}ms`);

    } catch (error) {
        console.log('❌ Error in performance test:', error.message);
    }
};

// Main test function
const runTests = async () => {
    console.log('🚀 Starting Elasticsearch Tests...\n');
    
    await connectDB();
    
    // Wait a bit for Elasticsearch to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        await testFuzzySearch();
        await testFilterProducts();
        await testSearchSuggestions();
        await testFilterOptions();
        await testPerformance();
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.log('\n❌ Test failed:', error.message);
    } finally {
        process.exit(0);
    }
};

// Run tests
runTests().catch(console.error);
