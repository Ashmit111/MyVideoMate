import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true,
            state.userData = action.payload
        },
        logout: (state) => {
            state.status = false,
            state.userData = null
        }
    }
})