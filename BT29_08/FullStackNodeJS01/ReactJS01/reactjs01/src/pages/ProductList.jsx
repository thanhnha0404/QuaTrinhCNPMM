import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products?page=${page}&limit=6`);
      const newProducts = res.data.DT.products;

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(page + 1);

      if (products.length + newProducts.length >= res.data.DT.total) {
        setHasMore(false); // hết dữ liệu
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={<h4>Đang tải thêm...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>Đã tải hết sản phẩm 🎉</p>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
              <img src={p.image} alt={p.name} style={{ width: "100%" }} />
              <h3>{p.name}</h3>
              <p>Giá: {p.price} VND</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ProductList;
