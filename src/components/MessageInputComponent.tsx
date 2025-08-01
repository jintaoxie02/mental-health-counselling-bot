"use client";

import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";

interface MessageInputComponentProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  language?: string;
}

export function MessageInputComponent({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  language = "Cantonese",
}: MessageInputComponentProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getPlaceholder = () => {
    switch (language) {
      case "Cantonese": return "分享你嘅想法同感受... 🤗";
      case "Mandarin": return "分享你的想法和感受... 🤗";
      case "English": return "Share your thoughts and feelings... 🤗";
      default: return "Share your thoughts and feelings... 🤗";
    }
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        p: { xs: 1, sm: 1.5 },
        borderTop: '1px solid',
        borderColor: 'rgba(0,0,0,0.1)',
        bgcolor: '#FFFFFF',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            border: '1px solid',
            borderColor: isFocused ? 'primary.main' : 'rgba(0,0,0,0.1)',
            bgcolor: '#F8F9FA',
            '&:hover': {
              borderColor: 'primary.light',
            },
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder={getPlaceholder()}
            value={input}
            onChange={onInputChange}
            disabled={isLoading}
            multiline
            maxRows={5}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            sx={{
              '& .MuiInputBase-input': { p: '10px 18px' },
              '& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: "none",
              },
            }}
          />
        </Paper>
        
        <IconButton
          type="submit"
          disabled={isLoading || !input.trim()}
          sx={{
            width: 44,
            height: 44,
            bgcolor: input.trim() ? 'primary.main' : 'rgba(0,0,0,0.1)',
            color: input.trim() ? 'white' : 'rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: input.trim() ? 'primary.dark' : 'rgba(0,0,0,0.15)',
              transform: input.trim() ? 'scale(1.05)' : 'none',
            },
            '&:disabled': {
              bgcolor: 'rgba(0,0,0,0.1)',
              color: 'rgba(0,0,0,0.3)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
