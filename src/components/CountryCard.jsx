// components/CountryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";

const CountryCard = ({ country }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };
  
  return (
    <Card 
      onClick={handleClick} 
      sx={{ 
        width: 280,
        height: 320,
        margin: 2, 
        cursor: "pointer",
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        border: '2px solid transparent',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          border: '2px solid white',
        }
      }}
    >
      <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        <CardMedia
          component="img"
          image={country.flags?.png}
          alt={`${country.name.common} flag`}
          sx={{ 
            maxHeight: 180, 
            maxWidth: '100%',
            objectFit: 'contain',
            padding: '8px'
          }}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.7)'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1, 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            alignSelf: 'center',
          }}
        >
          {country.name.common}
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Capital : </strong> {country.capital?.[0] || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Region | </strong> {country.region}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountryCard;
