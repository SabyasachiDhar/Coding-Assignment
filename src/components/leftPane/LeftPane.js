// src/components/LeftPane.js
import React from "react";
import { Paper, Typography, List } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addFile } from "../../features/appSlice"; // Updated import path
import Papa from "papaparse"; // For CSV parsing
import * as XLSX from "xlsx"; // For Excel file parsing
import { TopicOutlined } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid"; // Import UUID function
import FolderItem from "./FolderItem"; // Import FolderItem
import "./LeftPane.css"; // Import the CSS for styling

const LeftPane = () => {
  const dispatch = useDispatch();
  const sideBarListItems = useSelector((state) => state.app.sideBarListItems);

  const handleFileUpload = (folderIndex, subFolderIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx, .xls, .csv, .txt"; // Accept specific file types
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const newFile = {
          id: uuidv4(), // Generate a unique ID for the file
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
    <div style={{ height: "100%", display: "flex" }}>
      <Paper elevation={3} style={{ padding: "20px 10px", flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          Left Pane
        </Typography>

        <List style={{ padding: 0 }}>
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
    </div>
  );
};

export default LeftPane;
