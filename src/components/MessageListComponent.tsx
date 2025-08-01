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
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 1, sm: 1.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          // WhatsApp-style chat background
          background: 'linear-gradient(to bottom, #E3F2FD 0%, #F3E5F5 100%)',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(103, 80, 164, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(74, 156, 71, 0.05) 0%, transparent 50%)
          `,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.light',
            borderRadius: '4px',
          },
        }}
    >
      {messages.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            py: 4,
            opacity: 0.6,
          }}
        >
          <PsychologyIcon sx={{ fontSize: 48, color: 'primary.light', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Start Your Conversation
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Share your thoughts and feelings in a safe, confidential space
          </Typography>
        </Box>
      )}
      
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
                maxWidth: "75%",
                borderRadius: message.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                boxShadow: message.role === 'user' 
                  ? '0 2px 8px rgba(103, 80, 164, 0.15)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                p: { xs: 1.2, sm: 1.5 },
                background: message.role === 'user' 
                    ? '#6750A4'  // WhatsApp-style solid color for user
                    : '#F5F5F5', // Light gray like WhatsApp received messages
                position: 'relative',
                // WhatsApp-style message tail
                '&::after': message.role === 'user' ? {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  right: -6,
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid #6750A4',
                  borderTop: '6px solid transparent',
                } : {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: -6,
                  width: 0,
                  height: 0,
                  borderRight: '6px solid #F5F5F5',
                  borderTop: '6px solid transparent',
                },
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                    whiteSpace: "pre-wrap", 
                    wordBreak: "break-word",
                    color: message.role === "user" ? "#FFFFFF" : "#1C1B1F",
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    lineHeight: 1.4,
                    fontWeight: message.role === "user" ? 400 : 400,
                }}
              >
                {message.content}
              </Typography>
              
              {/* WhatsApp-style timestamp */}
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: message.role === "user" ? 'right' : 'left',
                  color: message.role === "user" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
                  fontSize: '0.75rem',
                  mt: 0.5,
                  fontWeight: 400,
                }}
              >
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        </Fade>
      ))}
      
      {isLoading && (
        <Fade in={true} timeout={300}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
              <PsychologyIcon />
            </Avatar>
            <Box
              sx={{
                maxWidth: "80%",
                borderRadius: '4px 20px 20px 20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                p: 1.5,
                background: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
              <Skeleton variant="text" width={100} height={20} sx={{ mt: 0.5 }} />
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
