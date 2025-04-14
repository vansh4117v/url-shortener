import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import urlSlice from "./urlSlice";

const store = configureStore({
	reducer: {
		user: userSlice,
		url: urlSlice,
	},
});

export default store;
