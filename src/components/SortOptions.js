// src/components/SortOptions.js
import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const SortOptions = ({ columns, onSave }) => {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [sortType, setSortType] = useState("");

  const handleSave = () => {
    if (selectedColumn && sortType) {
      onSave([{ field: selectedColumn, sort: sortType }]);
      // Clear selections after saving
      setSelectedColumn("");
      setSortType("");
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Column</InputLabel>
        <Select
          value={selectedColumn}
          onChange={(e) => {
            setSelectedColumn(e.target.value);
            setSortType(""); // Reset sort type when column changes
          }}
        >
          {columns.map((column) => (
            <MenuItem key={column.field} value={column.field}>
              {column.headerName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Sort Type</InputLabel>
        <Select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          disabled={!selectedColumn} // Disable until a column is selected
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={!selectedColumn || !sortType}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default SortOptions;
