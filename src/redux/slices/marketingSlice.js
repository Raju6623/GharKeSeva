import { createSlice } from '@reduxjs/toolkit';
import { fetchCoupons, fetchAddons, fetchBanners, fetchVendorCoupons } from '../thunks/marketingThunks';

const initialState = {
    coupons: [],
    addons: [],
    banners: [], // Added banners state
    vendorCoupons: [], // NEW: Vendor Offers
    loading: false,
    error: null,
};

const marketingSlice = createSlice({
    name: 'marketing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Banners
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
            })
            // Vendor Coupons
            .addCase(fetchVendorCoupons.fulfilled, (state, action) => {
                state.vendorCoupons = action.payload;
            });
    },
});

export default marketingSlice.reducer;
