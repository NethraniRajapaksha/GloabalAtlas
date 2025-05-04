import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        py: 2,
        backgroundColor: "transparent",
        textAlign: "center",
        zIndex: 1300, // Keep it above most elements,
        
        
      }}
    >
      <Typography variant="body2" color="white">
        © {new Date().getFullYear()} World Explorer | Nethrani_Rajapaksha
      </Typography>
    </Box>
  );
};

export default Footer;