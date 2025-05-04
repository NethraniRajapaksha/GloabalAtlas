// App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CountryPage from "./pages/CountryPage";
import Favourites from "./pages/FavouritesPage";

import { getUserSession } from "./utils/session";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Assuming you have a theme.js file for MUI theme

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = getUserSession();
    if (session) setUser(session);
  }, []);

  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
    
    <Router>
      
      <Routes>
        
        <Route path="/" element={user ? <Home user={user} /> : <Login onLogin={setUser} />} />
        <Route path="/country/:code" element={user ? <CountryPage user={user} /> : <Login onLogin={setUser} />} />
        <Route path="/favourites" element={user ? <Favourites user={user} /> : <Login onLogin={setUser} />} />
        </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
