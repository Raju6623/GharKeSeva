import { createSlice } from '@reduxjs/toolkit';
import { fetchCartItems, addItemToCart, removeItemFromCart } from '../thunks/cartThunks';

const initialState = {
    items: [],
    loading: false,
    error: null,
    totalAmount: 0,
};

const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        const price = Number(item.priceAmount) || Number(item.price) || 0;
        return total + (price * item.quantity);
    }, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalAmount = calculateTotal(state.items);
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Item
            .addCase(addItemToCart.fulfilled, (state, action) => {
                const newItem = action.payload;
                const existingItem = state.items.find(item => (item._id || item.id) === (newItem._id || newItem.id));
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.items.push({ ...newItem, quantity: 1 });
                }
                state.totalAmount = calculateTotal(state.items);
            })
            // Remove Item
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                const itemId = action.payload;
                state.items = state.items.filter(item => (item._id || item.id) !== itemId);
                state.totalAmount = calculateTotal(state.items);
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
