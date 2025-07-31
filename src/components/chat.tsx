"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box, ThemeProvider, CssBaseline, SelectChangeEvent, Container,
  Alert, Snackbar, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button, IconButton, Paper
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { AppBarComponent } from "./AppBarComponent";
import { MessageListComponent } from "./MessageListComponent";
import { MessageInputComponent } from "./MessageInputComponent";
import { mentalHealthTheme } from "@/theme";
import { useRouter } from "next/navigation";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
}

export function Chat({ initialLanguage = "Cantonese" }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await fetch('/api/client');
        if (!response.ok) throw new Error('Failed to get client ID');
        const data = await response.json();
        setClientId(data.clientId);
      } catch (e) {
        console.error("Failed to fetch client ID", e);
        setError("Could not establish a stable connection.");
      }
    };
    fetchClientId();
  }, []);

  useEffect(() => {
    if (!clientId) return;
    try {
      const savedMessages = localStorage.getItem(`chatHistory_${clientId}`);
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) { console.error("Failed to load messages", e); }
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    localStorage.setItem(`chatHistory_${clientId}`, JSON.stringify(messages));
  }, [messages, clientId]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);
    setError(null);
    
    let imageUrl: string | undefined = undefined;
    let imageBase64: string | undefined = undefined;

    if (selectedImage) {
        imageUrl = URL.createObjectURL(selectedImage);
        imageBase64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(selectedImage);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      imageUrl: imageUrl,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setPreviewUrl(null);
    
    abortControllerRef.current = new AbortController();

    try {
        const payload: any = { messages: newMessages, language, clientId };
        if (imageBase64) {
            const lastMessageWithImage = { ...userMessage, imageBase64 };
            payload.messages = [...messages, lastMessageWithImage];
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to get response from server.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantResponse = '';
        const assistantMessageId = (Date.now() + 1).toString();

        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
              if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') break;
                  try {
                      const parsed = JSON.parse(data);
                      if (parsed.content) {
                          assistantResponse += parsed.content;
                          setMessages(prev => prev.map(msg => 
                              msg.id === assistantMessageId 
                              ? { ...msg, content: assistantResponse } 
                              : msg
                          ));
                      }
                  } catch (e) { console.error('Error parsing SSE data:', e); }
              }
          }
        }

    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleReset = () => {
    if (!clientId) return;
    localStorage.removeItem(`chatHistory_${clientId}`);
    setMessages([]);
    setError(null);
    setOpenResetDialog(false);
  };
  
  const handleBack = () => {
    router.push("/");
  };
  
  return (
    <ThemeProvider theme={mentalHealthTheme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        overflow: 'hidden'
      }}>
        <AppBarComponent 
            language={language}
            onLanguageChange={handleLanguageChange}
            onReset={() => setOpenResetDialog(true)}
            onBackClick={handleBack}
            showBackButton={true}
        />

        <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
            <Paper elevation={4} sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', bgcolor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)' }}>
                <MessageListComponent
                  messages={messages}
                  isLoading={isLoading}
                />
                
                {previewUrl && (
                    <Box sx={{ px: 2, pt: 1 }}>
                        <Paper sx={{ p: 1, position: 'relative', width: 'fit-content', borderRadius: '12px' }}>
                            <IconButton onClick={removeImage} sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': {bgcolor: 'rgba(0,0,0,0.7)'}, p: 0.5 }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            <img src={previewUrl} alt="Preview" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                        </Paper>
                    </Box>
                )}

                <MessageInputComponent
                  input={input}
                  onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onSubmit={handleSubmit}
                  onImageChange={handleImageChange}
                  isLoading={isLoading}
                />
            </Paper>
        </Container>
        
        <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
            <DialogTitle>Reset Conversation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to permanently delete this conversation?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
                <Button onClick={handleReset} color="error">Reset</Button>
            </DialogActions>
        </Dialog>

        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </ThemeProvider>
  );
}
