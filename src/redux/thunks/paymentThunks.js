import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const createRazorpayOrder = createAsyncThunk(
    'payment/createRazorpayOrder',
    async (amount, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/payments/create-order', {
                amount: amount
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create Razorpay order');
        }
    }
);
