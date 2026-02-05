import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../thunks/authThunks';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    language: (JSON.parse(localStorage.getItem('user')) || {}).language || "English"
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
            if (state.user) {
                state.user.language = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Thunk Handlers
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                if (action.payload.language) {
                    state.language = action.payload.language;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, setLanguage } = authSlice.actions;
export default authSlice.reducer;
