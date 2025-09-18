require('dotenv').config();

// Check if Elasticsearch is enabled
const USE_ELASTICSEARCH = process.env.USE_ELASTICSEARCH === 'true';

let client = null;

if (USE_ELASTICSEARCH) {
  const elasticsearch = require('elasticsearch');
  
  client = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_URL || 'localhost:9200',
    log: 'trace'
  });

  // Kiểm tra kết nối Elasticsearch
  const checkConnection = async () => {
    try {
      const response = await client.ping();
      console.log('Elasticsearch connected successfully');
      return true;
    } catch (error) {
      console.error('Elasticsearch connection failed:', error);
      return false;
    }
  };

  // Tạo index cho products với mapping tối ưu cho fuzzy search
  const createProductIndex = async () => {
    try {
      const exists = await client.indices.exists({ index: 'products' });
      
      if (!exists) {
        await client.indices.create({
          index: 'products',
          body: {
            settings: {
              analysis: {
                analyzer: {
                  fuzzy_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'stop', 'snowball']
                  },
                  ngram_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'ngram_filter']
                  },
                  edge_ngram_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'edge_ngram_filter']
                  }
                },
                filter: {
                  ngram_filter: {
                    type: 'ngram',
                    min_gram: 2,
                    max_gram: 10
                  },
                  edge_ngram_filter: {
                    type: 'edge_ngram',
                    min_gram: 2,
                    max_gram: 15
                  }
                }
              }
            },
            mappings: {
              properties: {
                name: {
                  type: 'text',
                  analyzer: 'fuzzy_analyzer',
                  fields: {
                    ngram: {
                      type: 'text',
                      analyzer: 'ngram_analyzer'
                    },
                    edge_ngram: {
                      type: 'text',
                      analyzer: 'edge_ngram_analyzer'
                    },
                    keyword: {
                      type: 'keyword'
                    }
                  }
                },
                description: {
                  type: 'text',
                  analyzer: 'fuzzy_analyzer',
                  fields: {
                    ngram: {
                      type: 'text',
                      analyzer: 'ngram_analyzer'
                    }
                  }
                },
                category: {
                  type: 'keyword',
                  fields: {
                    text: {
                      type: 'text',
                      analyzer: 'fuzzy_analyzer'
                    }
                  }
                },
                price: {
                  type: 'float'
                },
                originalPrice: {
                  type: 'float'
                },
                discount: {
                  type: 'integer'
                },
                viewCount: {
                  type: 'integer'
                },
                tags: {
                  type: 'text',
                  analyzer: 'fuzzy_analyzer',
                  fields: {
                    ngram: {
                      type: 'text',
                      analyzer: 'ngram_analyzer'
                    }
                  }
                },
                inStock: {
                  type: 'boolean'
                },
                createdAt: {
                  type: 'date'
                },
                updatedAt: {
                  type: 'date'
                }
              }
            }
          }
        });
        console.log('Products index created successfully');
      }
    } catch (error) {
      console.error('Error creating products index:', error);
    }
  };

  // Thêm/sửa document trong Elasticsearch
  const indexProduct = async (product) => {
    try {
      await client.index({
        index: 'products',
        id: product._id.toString(),
        body: {
          name: product.name,
          description: product.description || '',
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          viewCount: product.viewCount,
          tags: product.tags || [],
          inStock: product.inStock,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    } catch (error) {
      console.error('Error indexing product:', error);
    }
  };

  // Xóa document khỏi Elasticsearch
  const deleteProduct = async (productId) => {
    try {
      await client.delete({
        index: 'products',
        id: productId.toString()
      });
    } catch (error) {
      console.error('Error deleting product from Elasticsearch:', error);
    }
  };

  // Tìm kiếm với Elasticsearch
  const searchProducts = async (query, filters = {}) => {
    try {
      const searchBody = {
        query: {
          bool: {
            must: []
          }
        },
        sort: [],
        from: filters.page ? (filters.page - 1) * (filters.limit || 10) : 0,
        size: filters.limit || 10
      };

      // Tìm kiếm text với fuzzy matching mạnh mẽ
      if (query && query.trim()) {
        searchBody.query.bool.must.push({
          bool: {
            should: [
              // 1. Exact match với boost cao nhất
              {
                multi_match: {
                  query: query,
                  fields: ['name^10', 'description^5', 'tags^3', 'category.text^3'],
                  type: 'phrase',
                  boost: 5
                }
              },
              // 2. Fuzzy match với fuzziness cao
              {
                multi_match: {
                  query: query,
                  fields: ['name^5', 'description^3', 'tags^2', 'category.text^2'],
                  type: 'best_fields',
                  fuzziness: 2, // Cho phép sai 2 ký tự
                  max_expansions: 100,
                  prefix_length: 0, // Không yêu cầu prefix match
                  boost: 4
                }
              },
              // 3. N-gram matching cho tìm kiếm gần đúng
              {
                multi_match: {
                  query: query,
                  fields: ['name.ngram^4', 'description.ngram^2', 'tags.ngram^2'],
                  type: 'most_fields',
                  boost: 3
                }
              },
              // 4. Edge n-gram cho prefix matching
              {
                multi_match: {
                  query: query,
                  fields: ['name.edge_ngram^6', 'description^2', 'tags^2'],
                  type: 'phrase_prefix',
                  boost: 3
                }
              },
              // 5. Wildcard search cho partial matches
              {
                multi_match: {
                  query: '*' + query + '*',
                  fields: ['name^3', 'description^2', 'tags', 'category.text'],
                  type: 'phrase_prefix',
                  boost: 2
                }
              }
            ],
            minimum_should_match: 1
          }
        });
      }

      // Lọc theo danh mục
      if (filters.category) {
        searchBody.query.bool.must.push({
          term: { category: filters.category }
        });
      }

      // Sắp xếp
      if (filters.sortBy) {
        const sortField = filters.sortBy;
        const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';
        searchBody.sort.push({ [sortField]: { order: sortOrder } });
      } else {
        searchBody.sort.push({ '_score': { order: 'desc' } });
      }

      const response = await client.search({
        index: 'products',
        body: searchBody
      });

      return {
        hits: response.hits.hits.map(hit => ({
          _id: hit._id,
          ...hit._source
        })),
        total: response.hits.total.value
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  };

  module.exports = {
    client,
    checkConnection,
    createProductIndex,
    indexProduct,
    deleteProduct,
    searchProducts
  };
} else {
  console.log('Elasticsearch is disabled. Using MongoDB only.');
  
  // Mock functions when Elasticsearch is disabled
  const mockFunction = async () => {
    console.log('Elasticsearch is disabled');
    return null;
  };

  module.exports = {
    client: null,
    checkConnection: mockFunction,
    createProductIndex: mockFunction,
    indexProduct: mockFunction,
    deleteProduct: mockFunction,
    searchProducts: mockFunction
  };
}