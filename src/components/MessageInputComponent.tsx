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
  
  // Context window protection: ~2000 tokens = ~8000 characters max per message
  const MAX_INPUT_LENGTH = 8000;
  const isOverLimit = input.length > MAX_INPUT_LENGTH;

  const getPlaceholder = () => {
    switch (language) {
      case "Cantonese": return "分享你嘅想法同感受... 🤗";
      case "Mandarin": return "分享你的想法和感受... 🤗";
      case "English": return "Share your thoughts and feelings... 🤗";
      default: return "Share your thoughts and feelings... 🤗";
    }
  };

  const getLimitMessage = () => {
    const remaining = MAX_INPUT_LENGTH - input.length;
    switch (language) {
      case "Cantonese": 
        return remaining < 0 
          ? `超出字數限制 ${Math.abs(remaining)} 個字符 😅` 
          : `仲可以輸入 ${remaining} 個字符`;
      case "Mandarin": 
        return remaining < 0 
          ? `超出字数限制 ${Math.abs(remaining)} 个字符 😅` 
          : `还可以输入 ${remaining} 个字符`;
      case "English": 
        return remaining < 0 
          ? `Over limit by ${Math.abs(remaining)} characters 😅` 
          : `${remaining} characters remaining`;
      default: 
        return remaining < 0 
          ? `Over limit by ${Math.abs(remaining)} characters 😅` 
          : `${remaining} characters remaining`;
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
            borderColor: isOverLimit ? 'error.main' : (isFocused ? 'primary.main' : 'rgba(0,0,0,0.1)'),
            bgcolor: isOverLimit ? 'rgba(255, 0, 0, 0.05)' : '#F8F9FA',
            '&:hover': {
              borderColor: isOverLimit ? 'error.main' : 'primary.light',
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
          disabled={isLoading || !input.trim() || isOverLimit}
          sx={{
            width: 44,
            height: 44,
            bgcolor: input.trim() && !isOverLimit ? 'primary.main' : 'rgba(0,0,0,0.1)',
            color: input.trim() && !isOverLimit ? 'white' : 'rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: input.trim() && !isOverLimit ? 'primary.dark' : 'rgba(0,0,0,0.15)',
              transform: input.trim() && !isOverLimit ? 'scale(1.05)' : 'none',
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
      
      {/* Character count indicator */}
      <Box sx={{ 
        px: 2, 
        py: 0.5, 
        textAlign: 'right',
        fontSize: '0.75rem',
        color: isOverLimit ? 'error.main' : 'text.secondary',
        opacity: input.length > MAX_INPUT_LENGTH * 0.8 ? 1 : 0.7,
        transition: 'all 0.2s ease',
      }}>
        {input.length > MAX_INPUT_LENGTH * 0.8 && getLimitMessage()}
      </Box>
    </Box>
  );
}
