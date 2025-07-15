// src/components/SubFolderItem.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setSelectedFileData } from "../../features/appSlice"; // Import the action

const SubFolderItem = ({
  subFolder,
  onFileUpload,
  folderIndex,
  subFolderIndex,
}) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch(); // Initialize the dispatch function

  const handleClick = (event) => {
    setOpen(!open);
    event.stopPropagation(); // Prevent the click from bubbling up
  };

  const handleUploadClick = (event) => {
    event.stopPropagation(); // Prevent the click from bubbling up
    onFileUpload(folderIndex, subFolderIndex); // Call the upload function
  };

  const handleShowFileData = (event, file) => {
    event.stopPropagation(); // Prevent the click from bubbling up
    // Check the file type and dispatch the selected file data
    if (
      file.filetype === "csv" ||
      file.filetype === "xls" ||
      file.filetype === "xlsx" ||
      file.filetype === "txt"
    ) {
      dispatch(setSelectedFileData([file])); // Dispatch the action to update the store with the selected file
    } else {
      console.error("Unsupported file type:", file.filetype);
    }
  };

  return (
    <>
      <ListItem button onClick={handleClick} style={{ padding: "8px 5px" }}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemText primary={subFolder.name} />
        <ListItemIcon onClick={handleUploadClick}>
          {subFolder.addFolterIconRight}
        </ListItemIcon>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subFolder.listItems.map((file, index) => (
            <ListItem
              key={index}
              style={{ paddingLeft: "35px", paddingRight: "6px" }}
            >
              <ListItemIcon>{file.fileIcon}</ListItemIcon>
              <ListItemText
                onClick={(event) => handleShowFileData(event, file)} // Pass the file to the handler
                primary={`${file.name}`}
              />{" "}
              {/* Display file name */}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SubFolderItem;
