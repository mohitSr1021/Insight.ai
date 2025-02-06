import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig/axios";
import axios from "axios";

// Signup api thunk
export const authSignup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/signup", userData);
            return response.data;
        } catch (error) {
            if ((error as any).response) {
                if (axios.isAxiosError(error) && (error as any).response) {
                    if (axios.isAxiosError(error) && (error as any).response) {
                        return rejectWithValue((error as any).response.data);
                    } else {
                        return rejectWithValue({ message: "Network error, please try again." });
                    }
                } else {
                    return rejectWithValue({ message: "Network error, please try again." });
                }
            } else {
                return rejectWithValue({ message: "Network error, please try again." });
            }
        }
    }
);

// Login api thunk
export const authLogin = createAsyncThunk(
    'auth/login',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/login", loginData);
            return response.data;
        } catch (error) {
            if ((error as any).response) {
                if (axios.isAxiosError(error) && error.response) {
                    return rejectWithValue(error.response.data);
                } else {
                    return rejectWithValue({ message: "Network error, please try again." });
                }
            } else {
                return rejectWithValue({ message: "Network error, please try again." });
            }
        }
    }
);
