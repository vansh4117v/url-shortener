import { createSlice } from "@reduxjs/toolkit";

const urlSlice = createSlice({
	name: "url",
	initialState: {
		longUrl: "example",
		shortUrl: "",
		title: "",
	},
	reducers: {
		setUrl: (state, action) => {
            state.longUrl = action.payload.longUrl;
            // console.log("🚀 ~ state:", state.url)
			state.title = action.payload.title||"";
			state.shortUrl = action.payload.shortUrl||"";
		},
		clearUrl: (state) => {
			state.longUrl = "";
			state.title = "";
			state.shortUrl = "";
		},
	},
});

export const { setUrl, clearUrl } = urlSlice.actions;
export default urlSlice.reducer;
