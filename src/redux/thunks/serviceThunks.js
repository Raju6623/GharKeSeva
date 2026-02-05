import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async Thunk for Fetching Services
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (category, { rejectWithValue }) => {
        try {
            // Fetch services with category filter
            const response = await api.get('/services', { params: { category } });

            // Backend returns straight array: res.status(200).json(data)
            const allServices = Array.isArray(response.data) ? response.data : (response.data.services || []);

            return allServices;

        } catch (error) {
            console.error("Fetch Error:", error);
            // On error, return empty array to prevent crash
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);
