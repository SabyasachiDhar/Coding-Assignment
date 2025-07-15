// src/components/LeftPane.js
import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import { ExpandLess, ExpandMore, TopicOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addFile } from "../features/appSlice"; // Updated import path
import Papa from "papaparse"; // For CSV parsing
import * as XLSX from "xlsx"; // For Excel file parsing

const LeftPane = () => {
  const dispatch = useDispatch();
  const sideBarListItems = useSelector(
    (state) => state.app.sideBarListItems // Updated to access the new app slice
  );

  const handleFileUpload = (folderIndex, subFolderIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls, .csv, .txt"; // Accept specific file types
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const newFile = {
          name: file.name,
          filetype: file.type.split("/").pop(), // Get file extension
          fileSize: `${(file.size / 1024).toFixed(2)} KB`, // Convert size to KB
          fileIcon: <TopicOutlined />, // Store the icon type as a string
          fileData: [], // Initialize an empty array for file data
        };

        // Handle CSV files
        if (newFile.filetype === "csv") {
          Papa.parse(file, {
            complete: (results) => {
              const headers = results.data[0]; // First row as headers
              const formattedData = results.data.slice(1).map((row) => {
                return headers.reduce((acc, header, index) => {
                  acc[header] = row[index]; // Map header to corresponding row value
                  return acc;
                }, {});
              });
              newFile.fileData = formattedData; // Store formatted data
              dispatch(addFile({ folderIndex, subFolderIndex, file: newFile }));
              console.log("Parsed CSV Data:", formattedData);
            },
            header: false, // Set to true if your CSV has headers
          });
        }
        // Handle Excel files
        else if (newFile.filetype === "xls" || newFile.filetype === "xlsx") {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = jsonData[0]; // First row as headers
            const formattedData = jsonData.slice(1).map((row) => {
              return headers.reduce((acc, header, index) => {
                acc[header] = row[index]; // Map header to corresponding row value
                return acc;
              }, {});
            });
            newFile.fileData = formattedData; // Store formatted data
            dispatch(addFile({ folderIndex, subFolderIndex, file: newFile }));
          };
          reader.readAsArrayBuffer(file);
        }
        // Handle text files
        else if (newFile.filetype === "txt") {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target.result;
            const rows = content.split("\n").map((row) => row.split("\t")); // Assuming tab-separated values

            const headers = rows[0]; // First row as headers
            const formattedData = rows.slice(1).map((row) => {
              return headers.reduce((acc, header, index) => {
                acc[header] = row[index]; // Map header to corresponding row value
                return acc;
              }, {});
            });
            newFile.fileData = formattedData; // Store formatted data
            dispatch(addFile({ folderIndex, subFolderIndex, file: newFile }));
          };
          reader.readAsText(file);
        }
      }
    };
    input.click(); // Open file dialog
  };

  return (
    <Paper elevation={3} style={{ padding: "20px 10px", height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Left Pane
      </Typography>

      <List>
        {sideBarListItems.map((folder, index) => (
          <FolderItem
            key={index}
            folder={folder}
            onFileUpload={handleFileUpload}
            folderIndex={index}
          />
        ))}
      </List>
    </Paper>
  );
};

const FolderItem = ({ folder, onFileUpload, folderIndex }) => {
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
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

const SubFolderItem = ({
  subFolder,
  onFileUpload,
  folderIndex,
  subFolderIndex,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick} style={{ padding: "8px 5px" }}>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        <ListItemIcon style={{ minWidth: "30px" }}>
          {subFolder.folderIconLeft}
        </ListItemIcon>
        <ListItemText primary={subFolder.name} />
        <ListItemIcon onClick={() => onFileUpload(folderIndex, subFolderIndex)}>
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
              <ListItemText primary={`${file.name}`} />{" "}
              {/* Display file name */}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default LeftPane;
