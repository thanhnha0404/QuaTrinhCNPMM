const { Client } = require('@elastic/elasticsearch');

// Cấu hình Elasticsearch client
const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    // Không cần auth cho local development
    // auth: {
    //     username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    //     password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    // },
    // Tùy chọn cho môi trường development
    ssl: {
        rejectUnauthorized: false
    }
});

// Kiểm tra kết nối Elasticsearch
const checkConnection = async () => {
    try {
        const response = await client.ping();
        console.log('✅ Elasticsearch connected successfully');
        return true;
    } catch (error) {
        console.log('❌ Elasticsearch connection failed:', error.message);
        return false;
    }
};

// Tạo index cho sản phẩm
const createProductIndex = async () => {
    try {
        const indexExists = await client.indices.exists({
            index: 'products'
        });

        if (!indexExists) {
            await client.indices.create({
                index: 'products',
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'keyword' },
                            name: { 
                                type: 'text',
                                analyzer: 'standard',
                                fields: {
                                    keyword: { type: 'keyword' },
                                    suggest: { type: 'completion' }
                                }
                            },
                            description: { 
                                type: 'text',
                                analyzer: 'standard'
                            },
                            price: { type: 'float' },
                            category: { 
                                type: 'keyword',
                                fields: {
                                    text: { type: 'text' }
                                }
                            },
                            image: { type: 'keyword' },
                            stock: { type: 'integer' },
                            rating: { type: 'float' },
                            viewCount: { type: 'integer' },
                            isActive: { type: 'boolean' },
                            tags: { type: 'keyword' },
                            discount: { type: 'float' },
                            createdAt: { type: 'date' },
                            updatedAt: { type: 'date' }
                        }
                    },
                    settings: {
                        analysis: {
                            analyzer: {
                                vietnamese_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase', 'asciifolding']
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Product index created successfully');
        } else {
            console.log('ℹ️ Product index already exists');
        }
    } catch (error) {
        console.log('❌ Error creating product index:', error.message);
    }
};

module.exports = {
    client,
    checkConnection,
    createProductIndex
};
