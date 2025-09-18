const { client, checkConnection, createProductIndex } = require('./src/config/elasticsearch');
const { seedDatabase } = require('./src/seedData');

const setupElasticsearch = async () => {
  try {
    console.log('🚀 Setting up Elasticsearch for fuzzy search...\n');
    
    // 1. Check Elasticsearch connection
    console.log('1️⃣ Checking Elasticsearch connection...');
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      console.log('❌ Elasticsearch connection failed!');
      console.log('Please make sure Elasticsearch is running on localhost:9200');
      console.log('You can start it with: docker run -p 9200:9200 -e "discovery.type=single-node" elasticsearch:7.17.0');
      process.exit(1);
    }
    
    // 2. Create index with fuzzy search mapping
    console.log('\n2️⃣ Creating products index with fuzzy search mapping...');
    await createProductIndex();
    
    // 3. Seed database with sample data
    console.log('\n3️⃣ Seeding database with sample products...');
    await seedDatabase();
    
    console.log('\n✅ Elasticsearch setup completed successfully!');
    console.log('🎯 Now you can test fuzzy search with "galay" to find "galaxy" products');
    console.log('🔍 Elasticsearch will handle all fuzzy search logic automatically');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
};

// Run setup
setupElasticsearch();


