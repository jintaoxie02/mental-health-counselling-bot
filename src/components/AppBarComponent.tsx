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
  Chip,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "text.primary",
        borderBottom: "1px solid", 
        borderColor: "rgba(103, 80, 164, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        },
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

          {/* Material Design 3 Donate Button */}
          <Tooltip title="Support Our Mission">
            <Chip
              icon={<FavoriteIcon />}
              label="Support"
              onClick={() => window.open('https://ko-fi.com/helloworld1024', '_blank')}
              sx={{
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                color: '#FF5722',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 87, 34, 0.2)',
                  borderColor: '#FF5722',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(255, 87, 34, 0.3)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: '#FF5722',
                },
              }}
            />
          </Tooltip>

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
