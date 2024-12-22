import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // Represents whether the user is logged in
  userData: null, // Holds user details when logged in
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = { 
        username: action.payload.username, 
        fullName: action.payload.fullName,
        email: action.payload.email, 
        avatar: action.payload.avatarUrl, 
        coverImage: action.payload.coverImageUrl, 
        accessToken: action.payload.accessToken 
      };
    },
    logout: (state) => {
      state.status = false;
      state.userData = null; // Clear user data on logout
    },
    updateUser: (state, action) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
