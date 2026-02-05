import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate backend delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get cart from localStorage
const getLocalCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Helper to save cart to localStorage
const saveLocalCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            await delay(500); // Simulate network delay
            return getLocalCart();
        } catch (error) {
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

export const addItemToCart = createAsyncThunk(
    'cart/addItemToCart',
    async (item, { getState, rejectWithValue }) => {
        try {
            await delay(300);

            // Get current list from State or LocalStorage?
            // Better to use state for consistency, but localStorage is our "database"
            const currentCart = getLocalCart();

            const serviceId = item.id || item._id || item.serviceId;
            const existingItem = currentCart.find(i => (i._id || i.id || i.serviceId) === serviceId);

            let updatedCart;

            if (existingItem) {
                updatedCart = currentCart.map(i =>
                    (i._id || i.id || i.serviceId) === serviceId
                        ? { ...i, quantity: (i.quantity || 1) + 1 }
                        : i
                );
            } else {
                const newItem = {
                    _id: serviceId, // Ensure consistent ID
                    serviceId: serviceId,
                    name: item.name || item.serviceName || item.packageName,
                    priceAmount: item.priceAmount || item.price,
                    quantity: 1,
                    packageImage: item.image || item.imageUrl || item.packageImage,
                    ...item // Keep other props
                };
                updatedCart = [...currentCart, newItem];
            }

            saveLocalCart(updatedCart);
            return updatedCart;

        } catch (error) {
            console.error(error);
            return rejectWithValue('Failed to add item');
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async (itemId, { getState, rejectWithValue }) => {
        try {
            await delay(300);
            const currentCart = getLocalCart();

            const existingItem = currentCart.find(i => (i._id || i.id || i.serviceId) === itemId);

            let updatedCart;

            if (existingItem && existingItem.quantity > 1) {
                updatedCart = currentCart.map(i =>
                    (i._id || i.id || i.serviceId) === itemId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                );
            } else {
                updatedCart = currentCart.filter(i => (i._id || i.id || i.serviceId) !== itemId);
            }

            saveLocalCart(updatedCart);
            return updatedCart;
        } catch (error) {
            return rejectWithValue('Failed to remove item');
        }
    }
);
