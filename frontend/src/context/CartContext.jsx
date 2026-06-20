import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!token) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) return false;
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
            });
            if (response.ok) {
                await fetchCart();
                return true;
            } else {
                const text = await response.text();
                throw new Error(text);
            }
        } catch (err) {
            alert(err.message || 'Failed to add item to cart');
            return false;
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (!token) return;
        try {
            const response = await fetch(`/api/cart/update/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            });
            if (response.ok) {
                await fetchCart();
            } else {
                const text = await response.text();
                throw new Error(text);
            }
        } catch (err) {
            alert(err.message || 'Failed to update quantity');
        }
    };

    const removeFromCart = async (cartItemId) => {
        if (!token) return;
        try {
            const response = await fetch(`/api/cart/remove/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                await fetchCart();
            }
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const clearCart = async () => {
        if (!token) return;
        try {
            const response = await fetch('/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setCartItems([]);
            }
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getCartTotal,
            getCartCount,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
