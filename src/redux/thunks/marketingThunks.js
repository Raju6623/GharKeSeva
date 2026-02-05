import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Marketing Thunks - dynamic
const getConfig = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

export const fetchBanners = createAsyncThunk(
    'marketing/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/banners', getConfig());
            return response.data;
        } catch (error) {
            // If backend endpoint missing, return empty or default to avoid crash during demo
            // But ideally this should come from DB.
            console.error("Banner fetch failed", error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
        }
    }
);

export const fetchCoupons = createAsyncThunk(
    'marketing/fetchCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/coupons', getConfig());
            return response.data;
        } catch (error) {
            return [];
        }
    }
);

export const fetchAddons = createAsyncThunk(
    'marketing/fetchAddons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/addons', getConfig());
            return response.data;
        } catch (error) {
            return [];
        }
    }
);

export const fetchVendorCoupons = createAsyncThunk(
    'marketing/fetchVendorCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/coupons/all/public', getConfig());
            return response.data;
        } catch (error) {
            return [];
        }
    }
);
