// src/App.js
import React from "react";
import { Grid } from "@mui/material";
import LeftPane from "./components/leftPane/LeftPane"; // Import LeftPane
import CenterPane from "./components/centerPane/CenterPane";
import RightPane from "./components/rightPane/RightPane";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Grid container spacing={1} style={{ height: "100vh" }}>
        {/* Left Pane */}
        <Grid size={{ xs: 12, sm: 2 }}>
          <LeftPane />
        </Grid>

        {/* Center Pane */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <CenterPane />
        </Grid>

        {/* Right Pane */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <RightPane />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
