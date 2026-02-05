import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

function CartProvider({ children }) {
  // Pehle check karega ki localStorage mein koi purana cart hai ya nahi
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Jab bhi cart change hoga, wo automatically localStorage mein save ho jayega
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service) => {
    setCart((prev) => {
      const exists = prev.find(item => item._id === service._id);
      if (exists) {
        return prev.map(item =>
          item._id === service._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // LocalStorage ko bhi saaf kar dega
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((total, item) => total + (item.priceAmount * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}