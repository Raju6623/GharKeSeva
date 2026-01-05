import { createAsyncThunk } from '@reduxjs/toolkit';

// Mock API for Bookings
const bookingService = {
    fetchBookings: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 'BK-001', serviceName: 'AC Repair', date: '2025-01-10', status: 'Confirmed' },
                { id: 'BK-002', serviceName: 'Plumbing', date: '2025-01-12', status: 'Pending' },
            ]), 1000);
        });
    },
    createBooking: async (bookingDetails) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ ...bookingDetails, id: `BK-${Date.now()}`, status: 'Pending' }), 1000);
        });
    }
};

export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await bookingService.fetchBookings();
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch bookings');
        }
    }
);

export const createNewBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingDetails, { rejectWithValue }) => {
        try {
            const response = await bookingService.createBooking(bookingDetails);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to create booking');
        }
    }
);
