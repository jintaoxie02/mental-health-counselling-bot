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
  language,
}: MessageInputComponentProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getPlaceholder = () => {
    switch (language) {
      case "Cantonese": return "分享你嘅想法...";
      case "Mandarin": return "分享你的想法...";
      default: return "Share your thoughts...";
    }
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        p: { xs: 1.5, sm: 2 },
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'transparent',
      }}
    >
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Paper
          elevation={isFocused ? 4 : 1}
          sx={{
            flex: 1,
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            boxShadow: isFocused 
              ? '0 4px 16px rgba(103, 80, 164, 0.2)'
              : '0 1px 4px rgba(0, 0, 0, 0.06)',
            bgcolor: 'background.default',
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
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: '0 4px 12px rgba(103, 80, 164, 0.3)',
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
