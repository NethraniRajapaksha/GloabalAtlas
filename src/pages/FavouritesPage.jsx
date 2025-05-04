// pages/FavoritesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { 
  getAllCountries, 
  getCountryByName, 
  getCountriesByRegion ,
  getCountriesByCodes
} from "../services/countryService";
import { getFavoriteCountries, removeFavoriteCountry } from "../utils/session";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Tooltip,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import {
  Favorite,
  Home as HomeIcon,
  DeleteOutline,
  Visibility,
  PersonOutline,
  FavoriteBorder,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FavoritesPage = ({ user }) => {
  const navigate = useNavigate();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      setLoading(true);
      try {
        // Get favorite country codes from localStorage
        const favoriteCodes = getFavoriteCountries();
        
        if (favoriteCodes.length === 0) {
          setFavoriteCountries([]);
          setLoading(false);
          return;
        }
        
        // Fetch country details for each code
        const countriesData = await getCountriesByCodes(favoriteCodes);
        setFavoriteCountries(countriesData);
      } catch (err) {
        console.error("Error fetching favorite countries:", err);
        setError("Failed to load favorite countries");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, []);

  const handleRemoveFavorite = (countryCode) => {
    removeFavoriteCountry(countryCode);
    // Update the state to reflect the change
    setFavoriteCountries(prevCountries => 
      prevCountries.filter(country => country.cca3 !== countryCode)
    );
  };

  const renderSkeletons = () => {
    return Array(4).fill().map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="rectangular" height={160} />
          <CardContent>
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="circular" width={40} height={40} sx={{ ml: 'auto' }} />
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header user={user} />
      <Container sx={{ flex: 1, mt: "64px", py: 4 }}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary">Favorite Countries</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Favorite Countries
          </Typography>
          
          {user && (
            <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <PersonOutline />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email || ''}
                </Typography>
              </Box>
              <Chip 
                icon={<Favorite fontSize="small" />} 
                label={`${favoriteCountries.length} favorites`} 
                color="primary" 
                variant="outlined"
                sx={{ ml: 'auto' }} 
              />
            </Paper>
          )}
          
          {!user && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Sign in to sync your favorite countries across devices.
            </Alert>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Favorite Countries Grid */}
        <Grid container spacing={3}>
          {loading ? (
            renderSkeletons()
          ) : favoriteCountries.length > 0 ? (
            favoriteCountries.map((country) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={country.cca3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {country.name.common}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {country.region} • {country.subregion || 'N/A'}
                    </Typography>
                    {country.capital && (
                      <Typography variant="body2">
                        Capital: {country.capital[0]}
                      </Typography>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/country/${country.cca3}`)}
                    >
                      View Details
                    </Button>
                    <Tooltip title="Remove from favorites">
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleRemoveFavorite(country.cca3)}
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <FavoriteBorder sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  You haven't added any favorite countries yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Browse countries and click the heart icon to add them to your favorites.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/')}
                >
                  Explore Countries
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default FavoritesPage;