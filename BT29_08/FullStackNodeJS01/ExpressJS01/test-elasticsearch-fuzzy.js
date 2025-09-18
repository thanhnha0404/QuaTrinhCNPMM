const { searchProducts } = require('./src/config/elasticsearch');

const testElasticsearchFuzzySearch = async () => {
  try {
    console.log('🔍 Testing Elasticsearch Fuzzy Search...\n');
    
    // Test cases for fuzzy search
    const testCases = [
      { query: 'galay', expected: 'galaxy', description: 'Should find "galaxy" products' },
      { query: 'samsun', expected: 'samsung', description: 'Should find "samsung" products' },
      { query: 'iphone', expected: 'iPhone', description: 'Should find "iPhone" products' },
      { query: 'macbook', expected: 'MacBook', description: 'Should find "MacBook" products' },
      { query: 'nike', expected: 'Nike', description: 'Should find "Nike" products' },
      { query: 'sony', expected: 'Sony', description: 'Should find "Sony" products' },
      { query: 'canon', expected: 'Canon', description: 'Should find "Canon" products' },
      { query: 'dyson', expected: 'Dyson', description: 'Should find "Dyson" products' },
      { query: 'lego', expected: 'LEGO', description: 'Should find "LEGO" products' },
      { query: 'playstation', expected: 'PlayStation', description: 'Should find "PlayStation" products' }
    ];
    
    for (const testCase of testCases) {
      console.log(`🔍 Testing: "${testCase.query}" (${testCase.description})`);
      
      const result = await searchProducts(testCase.query, { page: 1, limit: 5 });
      
      if (result && result.hits && result.hits.length > 0) {
        console.log(`✅ Found ${result.hits.length} products:`);
        result.hits.forEach(product => {
          console.log(`   - ${product.name} (${product.category})`);
        });
        
        // Check if expected product is found
        const foundExpected = result.hits.some(product => 
          product.name.toLowerCase().includes(testCase.expected.toLowerCase())
        );
        
        if (foundExpected) {
          console.log(`🎯 SUCCESS: Found expected "${testCase.expected}" product!`);
        } else {
          console.log(`⚠️  Expected "${testCase.expected}" not found in top results`);
        }
      } else {
        console.log(`❌ No products found`);
      }
      console.log('');
    }
    
    // Special test for "galay" -> "galaxy"
    console.log('🎯 SPECIAL TEST: "galay" should find "galaxy" products');
    const galaxyResult = await searchProducts('galay', { page: 1, limit: 10 });
    
    if (galaxyResult && galaxyResult.hits) {
      const galaxyProducts = galaxyResult.hits.filter(product => 
        product.name.toLowerCase().includes('galaxy')
      );
      
      if (galaxyProducts.length > 0) {
        console.log('✅ SUCCESS: Found Galaxy products with "galay" search:');
        galaxyProducts.forEach(product => {
          console.log(`   - ${product.name}`);
        });
        console.log('\n🎉 Fuzzy search is working perfectly!');
      } else {
        console.log('❌ FAILED: No Galaxy products found with "galay" search');
        console.log('Available products:');
        galaxyResult.hits.forEach(product => {
          console.log(`   - ${product.name}`);
        });
      }
    } else {
      console.log('❌ FAILED: No results returned');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testElasticsearchFuzzySearch();


