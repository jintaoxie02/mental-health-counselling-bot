"use client";

import { Box, Typography, Fade, Avatar, Skeleton } from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
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
            flex: '1 1 auto',
            overflowY: 'auto',
            minHeight: 0,
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}
    >
      {messages.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", color: "text.secondary", m: 'auto' }}>
          <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 500, color: 'primary.dark' }}>
            Start Conversation
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            I'm your counselor, ready to listen.
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
                maxWidth: "80%",
                borderRadius: message.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                p: message.imageUrl ? 1 : 1.5,
                background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #7E57C2 0%, #6750A4 100%)'
                    : '#FFFFFF',
              }}
            >
              {message.imageUrl && (
                <img 
                    src={message.imageUrl} 
                    alt="User upload" 
                    style={{ 
                        maxWidth: '100%', 
                        height: 'auto', 
                        borderRadius: '12px',
                        marginBottom: message.content ? '8px' : '0'
                    }} 
                />
              )}
              {message.content && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                      whiteSpace: "pre-wrap", 
                      wordBreak: "break-word",
                      color: message.role === "user" ? "primary.contrastText" : "text.primary",
                      px: message.imageUrl ? 0.5 : 0,
                      pb: message.imageUrl ? 0.5 : 0,
                  }}
                >
                  {message.content}
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      ))}
      
      {isLoading && (
        <Fade in={true} timeout={300}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                <PsychologyIcon />
            </Avatar>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: '4px 20px 20px 20px', p: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", width: 'fit-content' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Skeleton variant="circular" width={8} height={8} sx={{ animation: 'typing 1s infinite' }} />
                  <Skeleton variant="circular" width={8} height={8} sx={{ animation: 'typing 1s infinite 0.2s' }} />
                  <Skeleton variant="circular" width={8} height={8} sx={{ animation: 'typing 1s infinite 0.4s' }} />
              </Box>
            </Box>
          </Box>
        </Fade>
      )}
       <style>{`
          @keyframes typing {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-4px); }
          }
      `}</style>
    </Box>
  );
}
