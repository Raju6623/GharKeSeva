import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = "http://localhost:3001";

export const createRazorpayOrder = createAsyncThunk(
    'payment/createRazorpayOrder',
    async (amount, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/payments/create-order`, {
                amount: amount
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create Razorpay order');
        }
    }
);
