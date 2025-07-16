// src/components/CenterPane.js
import React from "react";
import { Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";

const CenterPane = () => {
  const selectedFileData = useSelector((state) => state.app.selectedFileData);

  const [sortedData, setSortedData] = React.useState([]);

  React.useEffect(() => {
    if (selectedFileData && selectedFileData.length > 0) {
      console.log("Selected File Data:", selectedFileData[0].fileData);
      setSortedData(selectedFileData[0].fileData); // Initialize with the first file's data
    }
  }, [selectedFileData]); // This dependency ensures it updates when selectedFileData changes

  const handleSort = (sortModel) => {
    let sorted = [...sortedData];

    // Sort based on the selected criteria
    sortModel.forEach(({ field, sort }) => {
      if (field && sort) {
        sorted.sort((a, b) => {
          if (sort === "asc") {
            return a[field] > b[field] ? 1 : -1;
          } else {
            return a[field] < b[field] ? 1 : -1;
          }
        });
      }
    });

    setSortedData(sorted); // Update the sorted data
  };

  // Ensure each row has a unique id
  const rowsWithId = sortedData.map((item, index) => ({
    id: item.id || index, // Use item's id if available, otherwise use index as a fallback
    ...item,
  }));

  const columns =
    rowsWithId.length > 0
      ? Object.keys(rowsWithId[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 150,
        }))
      : [];

  return (
    <Paper elevation={3} style={{ padding: "20px 10px", height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Center Pane
      </Typography>
      {rowsWithId.length > 0 ? (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rowsWithId} // Use rowsWithId which has unique ids
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            onSortModelChange={handleSort} // Use handleSort to sort data
          />
        </div>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Paper>
  );
};

export default CenterPane;
