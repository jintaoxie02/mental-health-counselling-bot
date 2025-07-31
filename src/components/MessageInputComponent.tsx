"use client";

import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useRef } from "react";

// ... (interface)

export function MessageInputComponent({
  input, onInputChange, onSubmit, onImageChange, isLoading
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        flexShrink: 0,
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'transparent', 
      }}
    >
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <input type="file" ref={fileInputRef} onChange={onImageChange} accept="image/*" style={{ display: 'none' }} />
        
        <IconButton onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <AddPhotoAlternateIcon />
        </IconButton>

        <TextField
            fullWidth
            variant="outlined"
            placeholder="Share your thoughts..."
            value={input}
            onChange={onInputChange}
            disabled={isLoading}
            multiline
            maxRows={5}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    bgcolor: 'background.paper',
                    '& fieldset': {
                        border: 'none',
                    },
                    '&:hover fieldset': {
                        border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                        border: '1px solid',
                        borderColor: 'primary.main',
                    },
                },
            }}
          />
        
        <IconButton
          type="submit"
          disabled={isLoading || !input.trim()}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
