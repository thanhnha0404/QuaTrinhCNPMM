import React, { useState, useEffect } from "react";
import { Button, Card } from "../src";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

const API_BASE = "http://localhost:3001/api";

interface CartItem {
  product: Product;
  quantity: number;
}

export const SimpleCartDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError("");
        console.log("Loading products...");
        const response = await fetch(`${API_BASE}/products?limit=10`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Products loaded:", data);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error loading products:", error);
        setError(`Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product._id === product._id);
      if (existingItem) {
        return prev.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => 
      prev.map(item => 
        item.product._id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>🛒 Cart Library Demo</h1>
      
      {error && (
        <div style={{ 
          padding: 12, 
          backgroundColor: "#fef2f2", 
          border: "1px solid #fecaca", 
          borderRadius: 8, 
          color: "#dc2626",
          marginBottom: 16 
        }}>
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Products */}
        <Card title={`Sản phẩm (${products.length})`}>
          {products.length === 0 ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {products.map((product) => (
                <div key={product._id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 12, 
                  padding: 8, 
                  border: "1px solid #e5e7eb", 
                  borderRadius: 8 
                }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{ 
                      width: 60, 
                      height: 60, 
                      objectFit: "cover", 
                      borderRadius: 4,
                      backgroundColor: "#f3f4f6"
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    backgroundColor: "#f3f4f6", 
                    borderRadius: 4,
                    display: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#6b7280",
                    textAlign: "center"
                  }}>
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                    <p style={{ margin: 0, color: "#059669", fontWeight: "bold" }}>
                      ${product.price}
                    </p>
                  </div>
                  <Button 
                    label="Thêm" 
                    onClick={() => addToCart(product)}
                    disabled={loading}
                    style={{ padding: "8px 16px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Cart */}
        <Card title={`Giỏ hàng (${cart.length} sản phẩm)`}>
          {cart.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Giỏ hàng trống</p>
          ) : (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cart.map((item) => (
                  <div key={item.product._id} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12, 
                    padding: 8, 
                    borderBottom: "1px solid #e5e7eb" 
                  }}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      style={{ 
                        width: 40, 
                        height: 40, 
                        objectFit: "cover", 
                        borderRadius: 4,
                        backgroundColor: "#f3f4f6"
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: "#f3f4f6", 
                      borderRadius: 4,
                      display: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: "#6b7280",
                      fontWeight: "bold"
                    }}>
                      {item.product.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: 0 }}>{item.product.name}</h5>
                      <p style={{ margin: 0, color: "#059669" }}>
                        ${item.product.price} × {item.quantity} = ${item.product.price * item.quantity}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Button 
                        label="-" 
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        style={{ padding: "4px 8px" }}
                      />
                      <span style={{ minWidth: 30, textAlign: "center" }}>{item.quantity}</span>
                      <Button 
                        label="+" 
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        style={{ padding: "4px 8px" }}
                      />
                      <Button 
                        label="Xóa" 
                        onClick={() => removeFromCart(item.product._id)}
                        style={{ padding: "4px 8px", backgroundColor: "#dc2626" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                marginTop: 16, 
                padding: 16, 
                backgroundColor: "#f3f4f6", 
                borderRadius: 8 
              }}>
                <h3 style={{ margin: 0 }}>
                  Tổng cộng: ${getTotal()}
                </h3>
                <Button 
                  label="Xóa tất cả" 
                  onClick={() => setCart([])}
                  style={{ marginTop: 8, backgroundColor: "#dc2626" }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
