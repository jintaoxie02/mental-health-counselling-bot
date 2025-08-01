"use client";

import { Chat } from "@/components/chat";
import { Box, Fab, alpha } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';

function ChatContent() {
  const searchParams = useSearchParams();
  const [initialLanguage, setInitialLanguage] = useState("Cantonese");

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam && ['Cantonese', 'Mandarin', 'English'].includes(langParam)) {
      setInitialLanguage(langParam);
    }
  }, [searchParams]);

  return (
    <Box sx={{ position: "relative", height: '100vh', width: '100vw' }}>
      <Chat initialLanguage={initialLanguage} />
      
      {/* Material Design 3 Floating Action Button (FAB) for Donate */}
      <Fab
        color="secondary"
        aria-label="support our mission"
        onClick={() => window.open('https://ko-fi.com/helloworld1024', '_blank')}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 16, md: 32 },
          backgroundColor: '#FF5722',
          color: 'white',
          '&:hover': {
            backgroundColor: '#E64A19',
            transform: 'scale(1.1)',
            boxShadow: `0 8px 16px ${alpha('#FF5722', 0.4)}`,
          },
          '&:active': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          zIndex: 1000,
          boxShadow: `0 4px 12px ${alpha('#FF5722', 0.3)}`,
        }}
      >
        <FavoriteIcon />
      </Fab>
    </Box>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'primary.main'
      }}>
        Loading...
      </Box>
    }>
      <ChatContent />
    </Suspense>
  );
}
