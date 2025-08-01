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
}

export function Chat({ initialLanguage = "Cantonese" }: { initialLanguage?: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Add initial greeting message based on language
  useEffect(() => {
    if (messages.length === 0) {
      let greeting = "";
      switch (language) {
        case "Cantonese":
          greeting = "你好呀！😊 我係你嘅心理輔導員，有咩想傾下？隨時都可以同我講 🤗";
          break;
        case "Mandarin":
          greeting = "你好！😊 我是你的心理辅导员，有什么想聊的吗？我会认真听的 💙";
          break;
        case "English":
          greeting = "Hey there! 😊 I'm your counselor - what's on your mind today? I'm here to listen 💙";
          break;
        default:
          greeting = "Hey there! 😊 I'm your counselor - what's on your mind today? I'm here to listen 💙";
      }
      
      setMessages([{
        id: "initial",
        role: "assistant",
        content: greeting
      }]);
    }
  }, [language, messages.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No reader available');
        }

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
        };

        setMessages(prev => [...prev, assistantMessage]);

        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            accumulatedContent += parsed.content;
                            setMessages(prev => 
                                prev.map(msg => 
                                    msg.id === assistantMessage.id 
                                        ? { ...msg, content: accumulatedContent }
                                        : msg
                                )
                            );
                        }
                        if (parsed.error) {
                            throw new Error(parsed.error);
                        }
                    } catch (e) {
                        // Skip malformed JSON
                        continue;
                    }
                }
            }
        }

    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            setError(error.message || 'An error occurred while getting response');
            // Remove the empty assistant message if there was an error
            setMessages(prev => prev.filter(msg => msg.id !== (Date.now() + 1).toString()));
        }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  };

  const handleReset = async () => {
    try {
      // Call DELETE endpoint to reset server-side session
      await fetch('/api/chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Reset local state
      setMessages([]);
      setError(null);
      setOpenResetDialog(false);
      
      // Add new greeting message
      let greeting = "";
      switch (language) {
        case "Cantonese":
          greeting = "你好呀！😊 我係你嘅心理輔導員，有咩想傾下？隨時都可以同我講 🤗";
          break;
        case "Mandarin":
          greeting = "你好！😊 我是你的心理辅导员，有什么想聊的吗？我会认真听的 💙";
          break;
        case "English":
          greeting = "Hey there! 😊 I'm your counselor - what's on your mind today? I'm here to listen 💙";
          break;
        default:
          greeting = "Hey there! 😊 I'm your counselor - what's on your mind today? I'm here to listen 💙";
      }
      
      setMessages([{
        id: "initial-" + Date.now(),
        role: "assistant",
        content: greeting
      }]);
      
    } catch (error) {
      setError('Failed to reset chat history');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <ThemeProvider theme={mentalHealthTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: 'background.default',
          overflow: 'hidden'
        }}
      >
        <AppBarComponent
          language={language}
          onLanguageChange={handleLanguageChange}
          onReset={() => setOpenResetDialog(true)}
          onBack={handleBack}
        />
        
        <Container 
          maxWidth="md" 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            overflow: 'hidden'
          }}
        >
          <Paper 
            elevation={4} 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: 'background.paper'
            }}
          >
            <MessageListComponent
              messages={messages}
              isLoading={isLoading}
            />
            
            <MessageInputComponent
              input={input}
              onInputChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </Paper>
        </Container>
        
        {/* Reset Confirmation Dialog */}
        <Dialog
          open={openResetDialog}
          onClose={() => setOpenResetDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'text.primary' }}>
            Reset Chat History
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'text.secondary' }}>
              Are you sure you want to reset your chat history? This action cannot be undone and all your conversation will be permanently deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button 
              onClick={() => setOpenResetDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReset}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2 }}
            >
              Reset
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}