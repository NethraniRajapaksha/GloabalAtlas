// components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearUserSession } from "../utils/session";

const Header = ({ user }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    clearUserSession();
    navigate("/");
    window.location.reload();
  };
  
  return (
    <AppBar 
      position="fixed"
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#070738', // Dark Blue
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ 
            cursor: "pointer",
            fontWeight: 'bold',
            color: '#ffffff',
            '&:hover': {
              opacity: 0.9
            }
          }}
          onClick={() => navigate("/")}
        >
          Global Atlas
        </Typography>
        {user && (
          <Button 
            color="inherit" 
            onClick={() => navigate("/favourites")}
            sx={{
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Fav Flags
          </Button>
        )}
        
        {user && (
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Logout
          </Button>
        )}
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;