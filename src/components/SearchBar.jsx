// components/SearchBar.jsx

import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      label="Search Country"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ marginBottom: 4 }}
    />
  );
};

export default SearchBar;
