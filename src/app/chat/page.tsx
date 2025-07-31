"use client";

import { Chat } from "@/components/chat";
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

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
