import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseURL, headerConfig } from "common/utils";

export interface User {
  name: String;
  email: String;
  _id: String;
  createdAt: Number;
  updatedAt: Number;
  status: Boolean;
  isVerified: Boolean;
  role: String;
  _v: Number;
  image?: String;
}

export interface ProfileValues {
  email: string;
  name: string;
  password: string;
  role: string;
  image?: string;
}

interface UserState {
  users: [] | Array<Partial<User>>;
  errors: null | Partial<{}>;
  response: null | Partial<{}>;
  loading: Boolean;
  mode: String;
  user: User | null;
  profile: ProfileValues | null;
}

export const fetchUsers = createAsyncThunk(
  "fetch/Users",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.get(baseURL + "/user/get-all", headerConfig);
      return response;
    } catch (err: AxiosError | any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "delete",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseURL}/user/delete-user/${id}`,
        headerConfig
      );
      return response;
    } catch (err: AxiosError | any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addUser = createAsyncThunk(
  "create/user",
  async (
    values: { email: String; name: String; password: String; userRole: String },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/user/create`,
        values,
        headerConfig
      );
      return response;
    } catch (error: AxiosError | any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "update/user",
  async (
    values: { name: String; password: String; userRole: String; id: any },
    { rejectWithValue }
  ) => {
    try {
      const { id, name, password, userRole } = values;
      const response = await axios.patch(
        `${baseURL}/user/update-user/${id}`,
        {
          name,
          password,
          userRole,
        },
        headerConfig
      );
      return response;
    } catch (error: AxiosError | any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "fetch/user",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/user/get-user/${id}`,
        headerConfig
      );
      return response;
    } catch (error: AxiosError | any) {
      rejectWithValue(error.response.data);
    }
  }
);

export const getProfile = createAsyncThunk(
  "/fetch-profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/user/my/profile`,
        headerConfig
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/update-profile",
  async (values: { password: String; name: String }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseURL}/user/update/my/profile`,
        values,
        headerConfig
      );

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

const initialState: UserState = {
  users: [],
  errors: null,
  response: null,
  loading: false,
  mode: "create",
  user: null,
  profile: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.response = null;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    userFormMode: (state, action) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.data.data;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, { payload }) => {
        state.errors = payload as Partial<{}>;
        state.loading = false;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.errors = payload as Partial<{}>;
        state.loading = false;
      });

    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, { payload }) => {
        state.errors = payload as Partial<{}>;
        state.loading = false;
      });

    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.data?.data._doc;
      })
      .addCase(fetchUser.rejected, (state, { payload }) => {
        state.errors = payload as Partial<{}>;
        state.loading = false;
      });

    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.profile = payload.data.data;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearErrors, clearResponse, userFormMode } = userSlice.actions;

export default userSlice.reducer;
