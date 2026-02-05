import { createSlice } from '@reduxjs/toolkit';
import { fetchServices } from '../thunks/serviceThunks';

const initialState = {
    availableServices: [],
    selectedService: null,
    loading: false,
    error: null,
    cache: {}, // New cache object
};

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        selectService: (state, action) => {
            state.selectedService = action.payload;
        },
        clearCache: (state) => {
            state.cache = {};
            state.availableServices = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.availableServices = action.payload;

                // Save to cache if category exists
                const category = action.meta.arg;
                if (category) {
                    state.cache[category] = action.payload;
                }
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { selectService, clearCache } = serviceSlice.actions;
export default serviceSlice.reducer;
