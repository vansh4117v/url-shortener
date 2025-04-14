import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        userData: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload;
            // console.log("🚀 ~ state.userData:", state.userData)
        },
        removeUser: (state) => {
            state.isLoggedIn = false;
            state.userData = null;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;