"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AppBarComponentProps {
  language: string;
  onLanguageChange: (event: SelectChangeEvent) => void;
  onReset: () => void;
  onBack: () => void;
}

export function AppBarComponent({
  language,
  onLanguageChange,
  onReset,
  onBack,
}: AppBarComponentProps) {

  return (
    <AppBar
      position="static" // Back to static to be part of the layout flow
      elevation={0}
      sx={{
        // A subtle glassmorphism effect that aligns with the Paper below
        backgroundColor: "rgba(255, 255, 255, 0.6)", 
        backdropFilter: "blur(10px)",
        color: "text.primary",
        // A very subtle border to create separation
        borderBottom: "1px solid", 
        borderColor: "rgba(0, 0, 0, 0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Back to Home">
            <IconButton onClick={onBack} sx={{ color: 'primary.dark' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.dark", display: { xs: 'none', sm: 'block' } }}>
            Mental Health Support
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" variant="outlined" sx={{ 
              minWidth: 140,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '20px',
              border: 'none',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }}>
            <Select
              value={language}
              onChange={onLanguageChange}
              sx={{ '& .MuiSelect-select': { display: "flex", alignItems: "center", gap: 1, py: 0.5, px: 2 } }}
            >
              <MenuItem value="Cantonese">🇭🇰 Cantonese</MenuItem>
              <MenuItem value="Mandarin">🇨🇳 Mandarin</MenuItem>
              <MenuItem value="English">🇺🇸 English</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Reset Conversation">
            <IconButton onClick={onReset} sx={{ color: 'error.main' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
