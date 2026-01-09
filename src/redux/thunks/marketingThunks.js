import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = "http://localhost:3001";

// Mock Data for fallback/simulation until backend is ready
const MOCK_COUPONS = [
    { id: 'YES1500', code: 'YES1500', title: 'Flat 10% off upto ₹1500', desc: 'Yes Bank CC EMI', save: 1500, minOrder: 5000 },
    { id: 'AXIS1000', code: 'AXIS1000', title: 'Flat 10% off upto ₹1000', desc: 'Axis Bank CC Full Swipe', save: 1000, minOrder: 3000 },
    { id: 'AMAZON125', code: 'AMAZON125', title: 'Amazon cashback upto ₹125', desc: 'Via Amazon Pay balance', save: 125, minOrder: 500 }
];

const MOCK_ADDONS = [
    { id: 'fan', name: 'Ceiling fan cleaning', price: 69, icon: 'https://cdn-icons-png.flaticon.com/512/1683/1683838.png' },
    { id: 'basin', name: 'Washbasin cleaning', price: 69, icon: 'https://cdn-icons-png.flaticon.com/512/3133/3133649.png' }
];

export const fetchCoupons = createAsyncThunk(
    'marketing/fetchCoupons',
    async (_, { rejectWithValue }) => {
        try {
            // In future: await axios.get(`${BACKEND_URL}/api/marketing/coupons`);
            // For now, simulate network delay return mock
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_COUPONS;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
        }
    }
);

export const fetchAddons = createAsyncThunk(
    'marketing/fetchAddons',
    async (_, { rejectWithValue }) => {
        try {
            // In future: await axios.get(`${BACKEND_URL}/api/marketing/addons`);
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_ADDONS;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addons');
        }
    }
);
