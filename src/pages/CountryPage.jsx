// pages/CountryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCountryByCode } from "../services/countryService";
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
  IconButton,
  Skeleton,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Tooltip,
  Breadcrumbs,
  Link,
  CardHeader,
  CardActions,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ArrowBack,
  Home as HomeIcon,
  LocationOn,
  People,
  Language,
  AttachMoney,
  BorderClear,
  Map as MapIcon,
} from "@mui/icons-material";
import {
  addFavoriteCountry,
  removeFavoriteCountry,
  isFavoriteCountry,
} from "../utils/session";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CountryPage = ({ user }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      try {
        const data = await getCountryByCode(code);
        if (data && data.length > 0) {
          setCountry(data[0]);
          // Check if this country is already a favorite
          setIsFavorite(isFavoriteCountry(data[0].cca3));
        } else {
          setError("Country not found");
        }
      } catch (err) {
        console.error("Error fetching country:", err);
        setError("Failed to load country information");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  const openInGoogleMaps = () => {
    if (!country) return;

    // Get country coordinates (center point)
    const lat = country.latlng?.[0];
    const lng = country.latlng?.[1];

    if (lat && lng) {
      // Open Google Maps in a new tab with the country name and coordinates
      const url = `https://www.google.com/maps/place/${encodeURIComponent(
        country.name.common
      )}/@${lat},${lng},6z`;
      window.open(url, "_blank");
    } else {
      // If coordinates aren't available, just search for the country name
      const url = `https://www.google.com/maps/search/${encodeURIComponent(
        country.name.common
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleToggleFavorite = () => {
    if (!country) return;

    if (isFavorite) {
      removeFavoriteCountry(country.cca3);
      setIsFavorite(false);
    } else {
      addFavoriteCountry(country.cca3);
      setIsFavorite(true);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header user={user} />
        <Container sx={{ flex: 1, mt: "64px", py: 4 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={300}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={30} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header user={user} />
        <Container sx={{ flex: 1, mt: "64px", py: 4 }}>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Container>

        <Footer />
      </Box>
    );
  }

  if (!country) return null;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header user={user} />
      <Container sx={{ flex: 1, mt: "64px", py: 4 }}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary">{country.name.common}</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        {/* Country Overview Card */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <Grid container>
            {/* Flag on left side */}
            <Grid item xs={12} md={5} sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                image={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                sx={{
                  height: { xs: 200, md: 300 },
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                  p: 2,
                }}
              />
              {/* Favorite icon positioned on top right of flag */}
              <Tooltip
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <IconButton
                  onClick={handleToggleFavorite}
                  color="primary"
                  size="large"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.2s, background-color 0.2s",
                    boxShadow: 1,
                  }}
                >
                  {isFavorite ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Tooltip>
            </Grid>

            {/* Country information on right side */}
            <Grid item xs={12} md={7}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <Typography variant="h4" gutterBottom component="div">
                  {country.name.common}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {country.name.official}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      Capital: {country.capital?.[0] || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      Region: {country.region || "N/A"}
                    </Typography>
                    <Typography variant="body1">
                      Subregion: {country.subregion || "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <People color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        People
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      Population: {country.population.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* Detailed Information */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Languages */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Language color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Languages
                </Typography>
              </Box>
              <Box>
                {country.languages &&
                Object.values(country.languages).length > 0 ? (
                  Object.values(country.languages).map((lang) => (
                    <Chip
                      key={lang}
                      label={lang}
                      sx={{ mr: 1, mb: 1 }}
                      size="medium"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No language information available
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Currencies */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoney color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Currencies
                </Typography>
              </Box>
              <Box>
                {country.currencies &&
                Object.values(country.currencies).length > 0 ? (
                  Object.values(country.currencies).map((curr, index) => (
                    <Chip
                      key={index}
                      label={`${curr.name} (${curr.symbol || "N/A"})`}
                      sx={{ mr: 1, mb: 1 }}
                      size="medium"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No currency information available
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Border Countries */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BorderClear color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Border Countries
                </Typography>
              </Box>
              <Box>
                {country.borders && country.borders.length > 0 ? (
                  country.borders.map((border) => (
                    <Chip
                      key={border}
                      label={border}
                      sx={{ mr: 1, mb: 1 }}
                      size="medium"
                      onClick={() => navigate(`/country/${border}`)}
                      clickable
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No border countries
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Button
          startIcon={<MapIcon />}
          variant="contained"
          color="primary"
          onClick={openInGoogleMaps}
          sx={{ mt: 2 }}
        >View On Google Map</Button>
      </Container>

      <Footer/>
    </Box>
  );
};

export default CountryPage;
