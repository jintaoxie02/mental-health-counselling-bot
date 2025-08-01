"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box, ThemeProvider, CssBaseline, SelectChangeEvent, Container,
  Alert, Snackbar, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button, Paper
} from "@mui/material";
import { AppBarComponent } from "./AppBarComponent";
import { MessageListComponent } from "./MessageListComponent";
import { MessageInputComponent } from "./MessageInputComponent";
import { mentalHealthTheme } from "@/theme";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    // No imageUrl property needed anymore
}

export function Chat({ initialLanguage = "Cantonese" }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // ... (useEffect hooks remain the same)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    abortControllerRef.current = new AbortController();

    try {
        const payload = { messages: newMessages, language };

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: abortControllerRef.current.signal,
        });

        // ... (streaming logic remains the same)

    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ... (other handlers: handleLanguageChange, handleReset, handleBack)

  return (
    <ThemeProvider theme={mentalHealthTheme}>
      <CssBaseline />
      <Box sx={{ /* ... */ }}>
        <AppBarComponent /* ... */ />
        <Container maxWidth="md" sx={{ /* ... */ }}>
            <Paper elevation={4} sx={{ /* ... */ }}>
                <MessageListComponent
                  messages={messages}
                  isLoading={isLoading}
                />
                
                {/* No image preview needed */}

                <MessageInputComponent
                  input={input}
                  onInputChange={(e) => setInput(e.target.value)}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
            </Paper>
        </Container>
        
        {/* ... (Dialogs and Snackbars) */}
      </Box>
    </ThemeProvider>
  );
}
