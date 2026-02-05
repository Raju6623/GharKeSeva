import { createSlice } from '@reduxjs/toolkit';
import { createRazorpayOrder } from '../thunks/paymentThunks';

const initialState = {
    loading: false,
    error: null,
    orderData: null,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.orderData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRazorpayOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRazorpayOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orderData = action.payload;
            })
            .addCase(createRazorpayOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPaymentError, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
