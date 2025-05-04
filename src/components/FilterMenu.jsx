// components/FilterMenu.jsx

import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterMenu = ({ selectedRegion, setSelectedRegion }) => {
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  return (
    <FormControl fullWidth sx={{ marginBottom: 4 }}>
      <InputLabel>Filter by Region</InputLabel>
      <Select
        value={selectedRegion}
        label="Filter by Region"
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {regions.map((region) => (
          <MenuItem key={region} value={region}>
            {region}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterMenu;
