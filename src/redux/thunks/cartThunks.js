import { createAsyncThunk } from '@reduxjs/toolkit';

// Mock API for Cart
const cartService = {
    fetchCart: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 101, name: 'AC Service', price: 500, quantity: 1 },
            ]), 800);
        });
    },
    addToCart: async (item) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(item), 500);
        });
    },
    removeFromCart: async (itemId) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(itemId), 500);
        });
    }
};

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartService.fetchCart();
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch cart');
        }
    }
);

export const addItemToCart = createAsyncThunk(
    'cart/addItemToCart',
    async (item, { rejectWithValue }) => {
        try {
            const response = await cartService.addToCart(item);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to add item');
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            await cartService.removeFromCart(itemId);
            return itemId;
        } catch (error) {
            return rejectWithValue('Failed to remove item');
        }
    }
);
