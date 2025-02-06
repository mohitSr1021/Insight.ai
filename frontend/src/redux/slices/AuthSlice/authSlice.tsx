import { createSlice } from '@reduxjs/toolkit';
import { authLogin, authSignup } from '../../api/authAPI';

const initialState = {
    user: localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails') || "") : null,
    accessToken: localStorage.getItem('token') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    isLoading: false,
    error: null as string | null | object,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('userDetails');
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
        },
    },
    extraReducers: (builder) => {
        // Handle signup
        builder.addCase(authSignup.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(authSignup.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            localStorage.setItem('userDetails', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
            localStorage.setItem('isAuthenticated', 'true');
        });
        builder.addCase(authSignup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload ?? 'Signup failed';
        });

        // Handle login
        builder.addCase(authLogin.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(authLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('userDetails', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
            localStorage.setItem('isAuthenticated', 'true');
        });
        builder.addCase(authLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Login failed';
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;