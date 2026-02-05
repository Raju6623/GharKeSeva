import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fullLocation: "Detecting location...",
    city: "Patna",
    isLoading: true
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            const { fullLocation, city } = action.payload;
            state.fullLocation = fullLocation;
            state.city = city || "Patna";
            state.isLoading = false;
        },
        setLocationLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setLocation, setLocationLoading } = locationSlice.actions;
export default locationSlice.reducer;
