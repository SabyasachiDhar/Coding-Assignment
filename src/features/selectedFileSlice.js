// src/features/selectedFileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedFileSlice = createSlice({
  name: "selectedFile",
  initialState: {
    selectedFileData: [],
  },
  reducers: {
    setSelectedFileData: (state, action) => {
      state.selectedFileData = action.payload;
    },
    updateFileData: (state, action) => {
      const { id, newFileData } = action.payload;
      const fileIndex = state.selectedFileData.findIndex(
        (file) => file.id === id
      );
      if (fileIndex !== -1) {
        state.selectedFileData[fileIndex].fileData = newFileData;
      }
    },
  },
});

export const { setSelectedFileData, updateFileData } =
  selectedFileSlice.actions;
export default selectedFileSlice.reducer;
