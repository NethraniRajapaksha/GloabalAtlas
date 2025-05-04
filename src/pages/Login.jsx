// pages/Login.jsx

import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Paper } from "@mui/material";
import { saveUserSession } from "../utils/session";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim()) {
      saveUserSession({ username });
      onLogin(username);
    }
  };

  return (
    <Box sx={{ 
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden"
    }}>
      {/* Video Background */}
      <Box sx={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        zIndex: -1 
      }}>
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
        <source src="/Background/BgVideoNewNew.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay to improve form readability */}
        <Box sx={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          backgroundColor: "rgba(0, 0, 0, 0.5)" 
        }} />
      </Box>
      
      {/* Login Form */}
      <Container maxWidth="sm" sx={{ 
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100vh - 140px)",
      }}>
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 4,
            backgroundColor: "rgba(0, 0, 0, 0.4)", 
            backdropFilter: "blur(8px)",
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: "bold", 
              color: "#ffffff",
              fontFamily: "'Poppins', sans-serif",
              textAlign: "center",
              mb: 3,
              letterSpacing: "1px"
            }}
          >
            GLOBAL ATLAS
          </Typography>
          
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            sx={{ 
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffffff",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ffffff",
              },
              "& .MuiInputBase-input": {
                color: "#ffffff",
              }
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              style: { fontFamily: "'Poppins', sans-serif" }
            }}
            InputLabelProps={{
              style: { fontFamily: "'Poppins', sans-serif" }
            }}
          />
          
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogin}
            sx={{ 
              backgroundColor: "transparent",
              padding: "12px 0",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              letterSpacing: "1px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#006994",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
              },
              transition: "all 0.3s ease"
            }}
          >
            LOGIN
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;