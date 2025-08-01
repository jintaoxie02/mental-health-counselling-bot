"use client";

import { Box, Typography, Fade, Avatar, Skeleton } from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  // No imageUrl property
}

interface MessageListComponentProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageListComponent({ messages, isLoading }: MessageListComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <Box 
        ref={scrollRef}
        sx={{ /* ... */ }}
    >
      {/* ... (empty message placeholder) */}
      
      {messages.map((message: Message) => (
        <Fade in={true} timeout={500} key={message.id}>
          <Box
            sx={{
              display: "flex",
              justifyContent: message.role === "user" ? "flex-end" : "flex-start",
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            {message.role === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <PsychologyIcon />
                </Avatar>
            )}

            <Box
              sx={{
                maxWidth: "80%",
                borderRadius: message.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                p: 1.5,
                background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #7E57C2 0%, #6750A4 100%)'
                    : '#FFFFFF',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                    whiteSpace: "pre-wrap", 
                    wordBreak: "break-word",
                    color: message.role === "user" ? "primary.contrastText" : "text.primary",
                }}
              >
                {message.content}
              </Typography>
            </Box>
          </Box>
        </Fade>
      ))}
      
      {/* ... (loading indicator) */}
    </Box>
  );
}
