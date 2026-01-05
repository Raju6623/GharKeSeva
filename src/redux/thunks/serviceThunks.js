import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = "http://localhost:3001";

// Async Thunk for Fetching Services
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (category, { rejectWithValue, getState }) => {
        try {
            // Check if data is already in cache
            const state = getState();
            if (category && state.services.cache && state.services.cache[category]) {
                return state.services.cache[category]; // Return cached data immediately
            }

            // If category is provided, append it to query, otherwise fetch all? 
            // The UI seems to always provide a category. 
            // Let's assume category is passed.
            const url = category
                ? `${BACKEND_URL}/api/auth/services?category=${category}`
                : `${BACKEND_URL}/api/auth/services`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);
