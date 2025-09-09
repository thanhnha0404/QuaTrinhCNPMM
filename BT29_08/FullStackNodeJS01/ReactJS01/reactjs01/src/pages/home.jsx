import { CrownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/products?page=${page}&limit=6`);
      const newProducts = res.data.DT.products;

      setProducts((prev) => [...prev, ...newProducts]);
      setPage(page + 1);

      if (products.length + newProducts.length >= res.data.DT.total) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("❌ Lỗi khi fetch sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>
        <CrownOutlined /> Danh sách sản phẩm
      </h1>

      <InfiniteScroll
        dataLength={products.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={<h4>Đang tải thêm...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>Đã tải hết sản phẩm 🎉</p>}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <h3>{p.name}</h3>
              <p>Giá: {p.price.toLocaleString()} VND</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
