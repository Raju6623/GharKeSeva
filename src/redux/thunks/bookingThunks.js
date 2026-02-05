import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

const getConfig = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return rejectWithValue('User not found');

            const user = JSON.parse(userStr);
            const userId = user._id || user.id; // Fallback to id if _id is missing

            if (!userId) return rejectWithValue('User ID not found');

            // Use the userId in the URL as expected by the backend
            const response = await api.get(`/bookings/user/${userId}`, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const createNewBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingDetails, { rejectWithValue }) => {
        try {
            const response = await api.post('/bookings/create', bookingDetails, getConfig());
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to create booking');
        }
    }
);
