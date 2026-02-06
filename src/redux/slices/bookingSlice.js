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
        updateDraftBooking: (state, action) => {
            state.draftBooking = { ...state.draftBooking, ...action.payload };
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
                const newBookings = action.payload.bookings || [];
                // Push each new booking into the list if it's an array, else handle legacy
                if (Array.isArray(newBookings)) {
                    state.list.push(...newBookings);
                } else if (action.payload.bookingId) {
                    // Fallback for any legacy structure
                    state.list.push(action.payload);
                }
                state.currentBooking = Array.isArray(newBookings) ? newBookings[0] : action.payload;
                state.lastCreatedBookings = Array.isArray(newBookings) ? newBookings : [action.payload];
            });
    },
});

export const { clearCurrentBooking, updateDraftBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
