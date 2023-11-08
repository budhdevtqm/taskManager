import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL, headerConfig, multitypeHeader } from "common/utils";

export interface TaskValues {
  createdBy: { name: "Admin"; id: "652f71dab52068789ef0540a" };
  _id: string;
  title: string;
  project: string;
  assignTo: [];
  dueDate: number;
  progressStatus: string;
  priority: string;
  createdAt: number;
  updatedAt: number;
  status: Boolean;
  type: string;
  __v: number;
  taskPay: string;
}

interface CreateValues {
  title: string;
  project: string;
  dueDate: string;
  type: string;
  priority: string;
  progressStatus: string;
  members: Array<User> | [];
}

export interface User {
  label: string;
  value: string;
}

export interface Project {
  name: String;
  id: String;
}

interface TaskInitials {
  tasks: Array<TaskValues> | [];
  users: Array<User> | [];
  task: TaskValues | null;
  projects: Array<Project> | [];
  loading: Boolean;
  mode: string;
  files: UploadedFile[] | [];
  createdTaskId: string;
}

export interface UploadedFile {
  createdAt: number;
  createdBy: string;
  filename: string;
  status: boolean;
  taskId: string;
  updatedAt: number;
  __v: number;
  _id: string;
}

const initialState: TaskInitials = {
  tasks: [],
  files: [],
  projects: [],
  users: [],
  task: null,
  loading: false,
  mode: "create",
  createdTaskId: "",
};

export const addTask = createAsyncThunk(
  "/task-create",
  async (values: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/task/create`,
        values,
        multitypeHeader
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

export const getTasks = createAsyncThunk(
  "/fetch-tasks",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/task/get/all`, headerConfig);
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

export const getProjects = createAsyncThunk(
  "/fetch-projects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/project/getAll`,
        headerConfig
      );
      const data = response.data.data;
      const updated = data.map((project: any) => ({
        name: project.name,
        id: project._id,
      }));
      return updated;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      } else {
        return rejectWithValue("An error occurred");
      }
    }
  }
);

export const getTaskFiles = createAsyncThunk(
  "/fetch-task-files",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/task/get-files/${id}`,
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

export const getUsers = createAsyncThunk(
  "/fetch-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/user/get/users`,
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

export const getTask = createAsyncThunk(
  "/get-task",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/task/${id}`, headerConfig);
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

export const updateStatus = createAsyncThunk(
  "/update-status",
  async (
    values: { id: String; progressStatus: String },
    { rejectWithValue }
  ) => {
    try {
      const { id } = values;
      const response = await axios.patch(
        `${baseURL}/task/update-status/${id}`,
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

export const deleteTask = createAsyncThunk(
  "/delete-task",
  async (id: String, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseURL}/task/${id}`,
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

export const updateTask = createAsyncThunk(
  "/update-task",
  async ({ values, id }: { values: any; id: string }, { rejectWithValue }) => {
    console.log("vlaues", values);
    console.log("id", id);
    try {
      const response = await axios.patch(
        `${baseURL}/task/${id}`,
        values,
        multitypeHeader
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

export const deleteFile = createAsyncThunk(
  "delete-file",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${baseURL}/task/delete/file/${id}`,
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

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    taskFormMode: (state, { payload }) => {
      state.mode = payload;
    },
  },
  extraReducers: (builder) => {
    // get projects
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.projects = payload;
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
      });

    //get users
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

    //get tasks
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload.data.data;
      })
      .addCase(getTasks.rejected, (state) => {
        state.loading = false;
      });

    // get Single task
    builder
      .addCase(getTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.task = payload.data.data;
      })
      .addCase(getTask.rejected, (state) => {
        state.loading = false;
      });

    // add task
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.createdTaskId = payload?.data.id;
      })
      .addCase(addTask.rejected, (state) => {
        state.loading = false;
      });

    // get Task Files
    builder
      .addCase(getTaskFiles.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getTaskFiles.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.files = payload.data.data;
      })
      .addCase(getTaskFiles.rejected, (state, { payload }) => {
        state.loading = false;
      });

    //delete task file
    builder
      .addCase(deleteFile.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, { payload }) => {
        state.loading = false;
      });
  },
});

export const { taskFormMode } = taskSlice.actions;
export default taskSlice.reducer;
