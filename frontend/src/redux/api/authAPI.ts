import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig/axios";
import axios from "axios";

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data || { message: "Network error, please try again." }
    );
  }
  return { message: "Network error, please try again." };
};

// Signup api thunk
export const authSignup = createAsyncThunk(
  "auth/signup",
  async (userData: Record<string, any>, { rejectWithValue }) => {
    try {
      const signupData = { ...userData };
      delete signupData.confirmPassword;

      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const authLogin = createAsyncThunk(
  "auth/login",
  async (loginData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Logout api thunk
export const authLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (error) {
      if ((error as any).response) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue({
            message: "Network error, please try again.",
          });
        }
      } else {
        return rejectWithValue({ message: "Network error, please try again." });
      }
    }
  }
);
