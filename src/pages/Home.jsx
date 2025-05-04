// pages/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import { 
  getAllCountries, 
  getCountryByName, 
  getCountriesByRegion 
} from "../services/countryService";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";
import { 
  Grid, 
  Container, 
  Box, 
  Typography, 
  CircularProgress,
  Alert,
  Fade,
  Pagination,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = ({ user }) => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const paginatedCountries = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return countries.slice(startIndex, startIndex + itemsPerPage);
  }, [countries, page]);

  const totalPages = useMemo(() => 
    Math.ceil(countries.length / itemsPerPage),
    [countries.length]
  );

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let data;
        if (searchTerm) {
          data = await getCountryByName(searchTerm);
        } else if (selectedRegion) {
          data = await getCountriesByRegion(selectedRegion);
        } else {
          data = await getAllCountries();
        }
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, searchTerm ? 300 : 0);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedRegion]);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError("Failed to load countries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
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
          <source src="/Background/HomeBg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <Box sx={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          backgroundColor: "rgba(0, 0, 0, 0.7)" 
        }} />
      </Box>

      <Header user={user} />
      
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          pt: { xs: 2, sm: 3 }, 
          pb: 6,
          mt: '64px',
          color: 'white',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 4
            }}
          >
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: "white",
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                }
              }}
            />

            <FilterMenu 
              selectedRegion={selectedRegion} 
              setSelectedRegion={setSelectedRegion} 
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgb(255, 255, 255)",
                  borderRadius: "8px",
                  color: "white",
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                }
              }}
            />
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(211, 47, 47, 0.2)', color: 'white' }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Typography 
              variant="subtitle1" 
              sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)', fontFamily: "'Poppins', sans-serif" }}
            >
              {countries.length === 0 
                ? "No countries found" 
                : `Showing ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}`}
            </Typography>
          )}

          {!loading && !error && (
            <>
              <Fade in={!loading}>
              <Grid container spacing={3} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
  {paginatedCountries.map((country) => (
    <Grid 
      item 
      key={country.cca3} 
      xs={12} 
      sm={6} 
      md={4} 
      lg={3}
      sx={{
        display: 'flex',
        justifyContent: 'center', // This centers the cards
        alignItems: 'center', // Vertically centers the card
        marginLeft: '10px', 
        marginRight: '10px',
      }}
    >
      <CountryCard country={country} />
    </Grid>
  ))}
</Grid>

              </Fade>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: "white",
                        borderColor: "rgb(255, 255, 255)",
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Home;
