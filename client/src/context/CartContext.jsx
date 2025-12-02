import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size = 'M', color = 'Black') => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item._id === product._id && item.size === size && item.color === color
            );

            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id && item.size === size && item.color === color
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, size, color, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId, size, color) => {
        setCart((prevCart) =>
            prevCart.filter(
                (item) => !(item._id === productId && item.size === size && item.color === color)
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
