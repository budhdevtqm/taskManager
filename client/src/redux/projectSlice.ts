import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL, headerConfig } from "common/utils";

export interface Project {
  name?: string;
  description?: string;
  members?: [{ name: string; id: string }];
  createdBy?: { name: string; id: string };
  createdAt?: number;
  updatedAt?: number;
  status?: boolean;
  isCompleted?: Boolean;
  _id: string;
  dueDate: number;
}

export interface SomeDetails {
  name: String;
  description: String;
  memebers: Array<RoleUser>;
  dueDate: String;
}

export interface RoleUser {
  label: string;
  value: string;
}

interface InitalStates {
  projects: Array<Project> | null;
  project: Project | null;
  loading: Boolean;
  mode: String;
  users: Array<RoleUser> | [];
}

const initialState: InitalStates = {
  projects: null,
  project: null,
  loading: false,
  users: [],
  mode: "create",
};

interface UpdateValues {
  name: String;
  dueDate: String;
  projectId: String;
  description: String;
}

export const getUsers = createAsyncThunk(
  "/get/users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseURL + "/user/get/users",
        headerConfig
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

export const getProjectById = createAsyncThunk(
  "/project-by-id",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/project/${id}`,
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

export const addProject = createAsyncThunk(
  "add/project",
  async (values: SomeDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        baseURL + "/project/create",
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

export const updateProject = createAsyncThunk(
  "update/project",
  async (values: UpdateValues, { rejectWithValue }) => {
    const { name, dueDate, description, projectId } = values;
    try {
      const response = axios.patch(
        `${baseURL}/project/update/${projectId}`,
        {
          name,
          dueDate,
          description,
        },
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

export const getAllUsers = createAsyncThunk(
  "fetch/users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        baseURL + "/user/get/users",
        headerConfig
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "fetch/projects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/project/getAll`,
        headerConfig
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

export const deleteProject = createAsyncThunk(
  "/delete-project",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseURL}/project/delete/${id}`,
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

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectFormMode: (state, { payload }) => {
      state.mode = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.projects = payload;
      })
      .addCase(getAllProjects.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.project = null;
      })
      .addCase(getProjectById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.project = payload.data.data;
      })
      .addCase(getProjectById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { projectFormMode } = projectSlice.actions;

export default projectSlice.reducer;
