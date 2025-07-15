// src/components/RightPane.js
import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateFileData } from "../features/appSlice"; // Import the action

const RightPane = () => {
  const dispatch = useDispatch();
  const selectedFileData = useSelector((state) => state.app.selectedFileData);

  // State to manage filters
  const [filters, setFilters] = useState([]);

  const handleAddFilter = () => {
    setFilters([...filters, { column: "", sortType: "" }]);
  };

  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const handleSaveChanges = () => {
    if (selectedFileData.length > 0) {
      let updatedFileData = [...selectedFileData[0].fileData];

      // Apply filters based on the selected criteria
      filters.forEach(({ column, sortType }) => {
        if (column) {
          // Example filter logic: Adjust according to your requirements
          updatedFileData = updatedFileData.filter((item) => {
            // Implement actual filtering logic based on filterType
            return true; // Placeholder for actual filtering logic
          });
        }
      });

      // Apply sorting based on the selected criteria
      filters.forEach(({ column, sortType }) => {
        if (column && sortType) {
          updatedFileData.sort((a, b) => {
            if (sortType === "asc") {
              return a[column] > b[column] ? 1 : -1;
            } else {
              return a[column] < b[column] ? 1 : -1;
            }
          });
        }
      });

      // Dispatch the action to update the fileData in the store
      dispatch(
        updateFileData({
          id: selectedFileData[0].id,
          newFileData: updatedFileData,
        })
      );
    }
  };

  const columns =
    selectedFileData && selectedFileData.length > 0
      ? Object.keys(selectedFileData[0].fileData[0]).map((key) => ({
          field: key,
          headerName: key,
        }))
      : [];

  console.log("Columns:", columns);

  return (
    <Paper elevation={3} style={{ height: "100%", padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Right Pane
      </Typography>
      <Typography>
        This is the right pane content. You can provide additional resources or
        links here.
      </Typography>

      {/* Add Filter Button */}
      <Button variant="contained" color="primary" onClick={handleAddFilter}>
        Add Filter
      </Button>

      {/* Render Filters */}
      {filters.map((filter, index) => (
        <Grid container spacing={2} key={index} style={{ marginTop: "10px" }}>
          <Grid size={{ md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Column</InputLabel>
              <Select
                value={filter.column}
                onChange={(e) =>
                  handleFilterChange(index, "column", e.target.value)
                }
              >
                {/* Add a placeholder for the selected filter */}
                <MenuItem value="" disabled>
                  {filter.column ? filter.column : "Select Column"}
                </MenuItem>
                {columns
                  .filter(
                    (col) =>
                      !filters.some((f) => f.column === col.field) ||
                      filter.column === col.field
                  )
                  .map((col) => (
                    <MenuItem key={col.field} value={col.field}>
                      {col.headerName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ md: 6 }}>
            <FormControl fullWidth disabled={!filter.column}>
              <InputLabel>Sort Type</InputLabel>
              <Select
                value={filter.sortType}
                onChange={(e) =>
                  handleFilterChange(index, "sortType", e.target.value)
                }
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}

      <Button variant="contained" color="success" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Paper>
  );
};

export default RightPane;
