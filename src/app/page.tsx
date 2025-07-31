"use client";

import { Box, Button, Typography, Container, Paper, Card, CardContent, Grid, Fade, Zoom, Slide, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import { mentalHealthTheme } from "@/theme";
import { useState, useEffect } from "react";
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupportIcon from '@mui/icons-material/Support';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';

export default function Home() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Cantonese");

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      id: 1,
      title: "Professional Support",
      description: "Expert counseling guidance tailored to your needs",
      icon: <PsychologyIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary.main"
    },
    {
      id: 2,
      title: "Safe & Confidential",
      description: "Your privacy and security are our top priority",
      icon: <SecurityIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success.main"
    },
    {
      id: 3,
      title: "24/7 Available",
      description: "Get support whenever you need it most",
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info.main"
    }
  ];

  const handleGetStarted = () => {
    // Smooth transition effect
    const button = document.querySelector('.get-started-button') as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      button.style.opacity = '0.8';
    }
    
    setTimeout(() => {
      router.push(`/chat?lang=${selectedLanguage}`);
    }, 150);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "Cantonese": return "🇭🇰 香港廣東話 (Hong Kong Cantonese)";
      case "Mandarin": return "🇨🇳 普通话 (Mandarin Chinese)";
      case "English": return "🇺🇸 English";
      default: return lang;
    }
  };

  return (
    <ThemeProvider theme={mentalHealthTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100vh",
          bgcolor: "background.default",
          textAlign: "center",
          overflowX: "hidden",
          py: 4,
        }}
      >
        {/* Enhanced Background Animation */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-20%",
              left: "-20%",
              width: "140%",
              height: "140%",
              background: "radial-gradient(circle, rgba(103, 80, 164, 0.08) 0%, rgba(74, 156, 71, 0.04) 50%, transparent 100%)",
              animation: "float 25s ease-in-out infinite",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: "60%",
              left: "80%",
              width: "150px",
              height: "150px",
              background: "radial-gradient(circle, rgba(208, 188, 255, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "pulse 10s ease-in-out infinite",
            },
            "@keyframes float": {
              "0%, 100%": {
                transform: "translate(0, 0) rotate(0deg)",
              },
              "25%": {
                transform: "translate(-3px, -3px) rotate(90deg)",
              },
              "50%": {
                transform: "translate(3px, -1px) rotate(180deg)",
              },
              "75%": {
                transform: "translate(-1px, 3px) rotate(270deg)",
              },
            },
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 0.3,
                transform: "scale(1)",
              },
              "50%": {
                opacity: 0.6,
                transform: "scale(1.1)",
              },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1, py: 2 }}>
          {/* Hero Section */}
          <Fade in={mounted} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Zoom in={mounted} timeout={1200}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                    textShadow: "0px 2px 4px rgba(103, 80, 164, 0.2)",
                    animation: "fadeInUp 1s ease-out",
                    "@keyframes fadeInUp": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(30px)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  Mental Health Support
                </Typography>
              </Zoom>
              
              <Slide direction="up" in={mounted} timeout={1400}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                    fontWeight: 400,
                    color: "text.secondary",
                    mb: 3,
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.4,
                    animation: "fadeInUp 1.2s ease-out",
                  }}
                >
                  Professional counseling support available 24/7.
                </Typography>
              </Slide>

              {/* Language Selection Section */}
              <Fade in={mounted} timeout={1500}>
                <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                    }}
                  >
                    <LanguageIcon color="primary" />
                    Choose Your Language
                  </Typography>
                  
                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel 
                      id="homepage-language-select-label"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      Select Language
                    </InputLabel>
                    <Select
                      labelId="homepage-language-select-label"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      label="Select Language"
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "scale(1.02)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                            borderWidth: 2,
                          },
                        },
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <MenuItem value="Cantonese" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span style={{ fontSize: "1.2em" }}>🇭🇰</span>
                        香港廣東話 (Hong Kong Cantonese)
                      </MenuItem>
                      <MenuItem value="Mandarin" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span style={{ fontSize: "1.2em" }}>🇨🇳</span>
                        普通话 (Mandarin Chinese)
                      </MenuItem>
                      <MenuItem value="English" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span style={{ fontSize: "1.2em" }}>🇺🇸</span>
                        English
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      opacity: 0.8,
                      maxWidth: "350px",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    {selectedLanguage === "Cantonese" && "地道香港廣東話口語，可以中英夾雜，適應世界各地用戶"}
                    {selectedLanguage === "Mandarin" && "標準普通話，適應不同地區用戶"}
                    {selectedLanguage === "English" && "Natural English conversation with global accessibility"}
                  </Typography>
                </Box>
              </Fade>

              <Fade in={mounted} timeout={1600}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  className="get-started-button"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 3,
                    py: 1.25,
                    fontSize: { xs: "1rem", sm: "1.125rem" },
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0px 4px 20px rgba(103, 80, 164, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: "fadeInUp 1.4s ease-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 8px 30px rgba(103, 80, 164, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </Fade>
            </Box>
          </Fade>

          {/* Features Section */}
          <Fade in={mounted} timeout={1800}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={feature.id}>
                  <Zoom in={mounted} timeout={2000 + index * 200}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        backgroundColor: "background.paper",
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
                          borderColor: feature.color,
                        },
                        border: "2px solid transparent",
                      }}
                      onMouseEnter={() => setActiveFeature(feature.id)}
                      onMouseLeave={() => setActiveFeature(null)}
                    >
                      <CardContent sx={{ p: 2, textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 1.5,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: activeFeature === feature.id ? "scale(1.1)" : "scale(1)",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            mb: 0.5,
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.4,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Fade>

          {/* Additional Info */}
          <Fade in={mounted} timeout={2200}>
            <Box sx={{ mt: 4, opacity: 0.8 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: "500px",
                  mx: "auto",
                  lineHeight: 1.5,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Professional mental health support with privacy and confidentiality at its core.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
