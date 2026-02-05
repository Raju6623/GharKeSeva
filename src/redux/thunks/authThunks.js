import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', {
        userEmail: credentials.email,
        userPassword: credentials.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk for Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
