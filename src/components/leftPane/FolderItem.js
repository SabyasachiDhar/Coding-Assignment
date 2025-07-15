// src/components/FolderItem.js
import React from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  List,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SubFolderItem from "./SubFolderItem"; // Ensure this import is correct

const FolderItem = ({ folder, onFileUpload, folderIndex, onShowFileData }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{folder.folderIcon}</ListItemIcon>
        <ListItemText primary={folder.folderName} />
        {folder.listItems.length > 0 ? (
          open ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )
        ) : null}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {folder.listItems.map((subFolder, index) => (
            <SubFolderItem
              key={index}
              subFolder={subFolder}
              onFileUpload={onFileUpload}
              folderIndex={folderIndex}
              subFolderIndex={index}
              onShowFileData={onShowFileData} // Pass the function to SubFolderItem
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default FolderItem;
