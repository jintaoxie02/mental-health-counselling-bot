"use client";

import { Chat } from "@/components/chat";
import { Box, Fab, alpha } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';


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
      
      {/* Material Design 3 Floating Action Button (FAB) for GitHub Repository */}
      <Fab
        color="primary"
        aria-label="view source code on github"
        onClick={() => window.open('https://github.com/jintaoxie02/mental-health-counselling-bot', '_blank')}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 16, md: 32 },
          backgroundColor: '#24292f',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1c2128',
            transform: 'scale(1.1)',
            boxShadow: `0 8px 16px ${alpha('#24292f', 0.4)}`,
          },
          '&:active': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          zIndex: 1000,
          boxShadow: `0 4px 12px ${alpha('#24292f', 0.3)}`,
        }}
      >
        <GitHubIcon />
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
