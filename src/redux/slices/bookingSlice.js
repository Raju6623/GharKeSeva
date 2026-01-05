import { createSlice } from '@reduxjs/toolkit';
import { fetchBookings, createNewBooking } from '../thunks/bookingThunks';

const initialState = {
    list: [],
    currentBooking: null,
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Bookings
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Booking
            .addCase(createNewBooking.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.currentBooking = action.payload;
            });
    },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
