import { createSlice } from '@reduxjs/toolkit';
import { fetchCoupons, fetchAddons } from '../thunks/marketingThunks';

const initialState = {
    coupons: [],
    addons: [],
    loading: false,
    error: null,
};

const marketingSlice = createSlice({
    name: 'marketing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Coupons
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Addons
            .addCase(fetchAddons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddons.fulfilled, (state, action) => {
                state.loading = false;
                state.addons = action.payload;
            })
            .addCase(fetchAddons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default marketingSlice.reducer;
