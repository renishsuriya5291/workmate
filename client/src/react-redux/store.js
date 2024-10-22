import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    proflie: {
      projects: [],
    },
    jobs: [],
    proposals: [],
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.proflie.projects = [];
      state.jobs = [];
      state.proposals = [];
    },
    setUser: (state, action) => {
      if (action.payload.user) {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.proflie.projects = [];
        state.jobs = [];
        state.proposals = [];
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload.user };
    },

    setImage: (state, action) => {
      if (state.user) {
        state.user.profilePicture = action.payload;
      }
    },
    addAllProjects: (state, action) => {
      state.proflie.projects = action.payload; // Replace the projects array with new data
    },
    addProject: (state, action) => {
      state.proflie.projects.push(action.payload); // Add a single project
    },
    updateProject: (state, action) => {
      const index = state.proflie.projects.findIndex(
        (project) => project._id === action.payload._id
      );
      if (index !== -1) {
        state.proflie.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action) => {
      state.proflie.projects = state.proflie.projects.filter(
        (project) => project._id !== action.payload._id
      );
    },
    deleteAll: (state) => {
      state.proflie.projects = [];
    },
    setUserItem: (state, action) => {
      const updatedUser = action.payload;

      // Merge the updated fields into the existing user state
      state.user = {
        ...state.user,
        ...updatedUser,
      };
    },
    addjob: (state, action) => {
      state.jobs.push(action.payload.job); // Add the new job
    },
    addAllJobs: (state, action) => {
      state.jobs = action.payload;
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(
        (job) => job._id === action.payload._id
      );
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action) => {
      state.jobs = state.jobs.filter((job) => job._id !== action.payload._id);
    },
    addPropsal: (state, action) => {
      // console.log("ae");
      state.proposals.push(action.payload);
    },
    addAllPropsal: (state, action) => {
      console.log("gsiufg");
      state.proposals = action.payload;
    },
    updateProposal: (state, action) => {
      const index = state.proposals.findIndex(
        (proposal) =>
          proposal._id === action.payload._id &&
          proposal.job === action.payload.job &&
          proposal.freelancer === action.payload.freelancer
      );
      if (index !== -1) {
        state.proposals[index] = action.payload;
      }
    },
    removeProposal: (state, action) => {
      console.log("first");
      state.proposals = state.proposals.filter(
        (proposal) => proposal._id !== action.payload._id
      );
    },
  },
});

export const {
  login,
  logout,
  setUser,
  setImage,
  addProject,
  updateProject,
  deleteProject,
  addAllProjects,
  setUserItem,
  deleteAll,
  addjob,
  addAllJobs,
  updateJob,
  deleteJob,
  updateUser,
  addPropsal,
  addAllPropsal,
  updateProposal,
  removeProposal,
} = authSlice.actions;

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
