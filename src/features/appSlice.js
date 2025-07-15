// src/features/appSlice.js
import { createSlice } from "@reduxjs/toolkit";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";

const initialState = {
  sideBarListItems: [
    {
      folderName: "Folder 1",
      folderIcon: <FolderOutlined />, // Use the actual icon component
      listItems: [
        {
          name: "Sub Folder 1",
          folderIconLeft: <FolderOutlined />, // Use the actual icon component
          addFolterIconRight: <CreateNewFolderOutlined />, // Use the actual icon component
          listItems: [], // This will hold the files added
        },
        {
          name: "Sub Folder 2",
          folderIconLeft: <FolderOutlined />, // Use the actual icon component
          addFolterIconRight: <CreateNewFolderOutlined />, // Use the actual icon component
          listItems: [], // This will hold the files added
        },
      ],
    },
  ],
  selectedFileData: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addFile: (state, action) => {
      const { folderIndex, subFolderIndex, file } = action.payload;

      // Defensive checks
      const folder = state.sideBarListItems[folderIndex];
      if (folder && folder.listItems[subFolderIndex]) {
        // Push the new file into the appropriate subfolder's listItems
        folder.listItems[subFolderIndex].listItems.push(file);
      } else {
        console.error(
          "Invalid folder or subfolder index:",
          folderIndex,
          subFolderIndex
        );
      }
    },
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

// Export the actions to be used in the component
export const { addFile, setSelectedFileData, updateFileData } =
  appSlice.actions;

// Export the reducer to be used in the store
export default appSlice.reducer;
