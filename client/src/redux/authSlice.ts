import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { baseURL } from "../common/utils";
import axios from "axios";

export interface authInitials {
  error: null | Partial<{}>;
  user: null | Partial<{}>;
  isLoggedIn: boolean;
  mode: string;
  role: string;
  email: string;
  loading: boolean;
}

export interface AuthSlice {
  auth: {
    user: {
      message: string;
    };
  };
}

const initialState: authInitials = {
  user: null,
  isLoggedIn: false,
  role: "",
  email: "",
  mode: "login",
  loading: false,
  error: null,
};

export const signup = createAsyncThunk(
  "/signup-user",
  async (
    values: { email: string; name: string; password: string },
    { rejectWithValue }
  ) => {
    const { email, name, password } = values;
    try {
      const response = await axios.post(`${baseURL}/user/register`, {
        name,
        email,
        password,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "/resend",
  async (values: { email: string }, { rejectWithValue }) => {
    const { email } = values;
    try {
      const response = await axios.post(`${baseURL}/user/resend-otp`, {
        email,
      });
      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "/verify-otp",
  async (values: { email: string; otp: string }, { rejectWithValue }) => {
    const { email, otp } = values;
    try {
      const response = await axios.post(`${baseURL}/user/verify-otp`, {
        email,
        otp,
      });
      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const loginHandler = createAsyncThunk(
  "/login",
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    const { email, password } = values;
    try {
      const response = await axios.post(`${baseURL}/user/password-signin`, {
        email,
        password,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleMode: (state) => {
      if (state.mode === "login") {
        state.mode = "signup";
        return;
      }
      state.mode = "login";
    },

    mailSetter: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    removeMail: (state) => {
      state.email = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOTP.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(loginHandler.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginHandler.fulfilled, (state, action) => {
        localStorage.setItem("token", action?.payload?.data?.token || "");
        localStorage.setItem("role", action?.payload?.data?.role || "");
        state.user = action.payload?.data;
      })
      .addCase(loginHandler.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { toggleMode, mailSetter, removeMail } = authSlice.actions;
export default authSlice.reducer;
