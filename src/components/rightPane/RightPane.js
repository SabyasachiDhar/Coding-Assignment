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
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateFileData } from "../../features/appSlice"; // Import the action
import "./RightPane.css"; // Import the CSS for styling
import {
  AddOutlined,
  CloseOutlined,
  DeleteForeverOutlined,
  SaveOutlined,
} from "@mui/icons-material";

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

  const handleDeleteFilter = (index) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleCancel = () => {
    setFilters([]); // Reset the filters array
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

  // Function to check if the Save button should be disabled
  const isSaveDisabled = () => {
    return !filters.some((filter) => filter.column && filter.sortType);
  };

  return (
    <Paper elevation={3} style={{ height: "100%", padding: "20px 10px" }}>
      <Typography variant="h5" gutterBottom>
        Right Pane
      </Typography>

      {/* Add Filter Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h6">
          Total column to sort: {filters.length}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleAddFilter}
          startIcon={<AddOutlined />}
        >
          Add Filter
        </Button>
      </Box>

      {/* Render Filters */}
      {filters.map((filter, index) => (
        <Grid container spacing={1} key={index}>
          <Grid size={{ md: 5 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel style={{ left: "-13px" }}>Select column</InputLabel>
              <Select
                variant="standard"
                sx={{ m: 0 }}
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
          <Grid size={{ md: 5 }}>
            <FormControl fullWidth disabled={!filter.column}>
              <InputLabel>Select sort type</InputLabel>
              <Select
                variant="standard"
                className="selectItem"
                sx={{ m: 0 }}
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
          <Grid size={{ md: 2 }}>
            <Button onClick={() => handleDeleteFilter(index)}>
              <DeleteForeverOutlined
                style={{ width: "30px", marginTop: "14px" }}
                color="error"
              />
            </Button>
          </Grid>
        </Grid>
      ))}

      {/* Flexbox for Save and Cancel buttons */}
      <Box display="flex" justifyContent="flex-end" marginTop={2}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveChanges}
          endIcon={<SaveOutlined />}
          size="small"
          disabled={isSaveDisabled()} // Disable the button based on the check
        >
          Save Changes
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          startIcon={<CloseOutlined />}
          size="small"
          style={{ marginLeft: "10px" }} // Add some space between buttons
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

export default RightPane;
