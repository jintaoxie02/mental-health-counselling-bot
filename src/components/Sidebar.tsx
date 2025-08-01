"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  Divider,
  IconButton,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onNewChat?: () => void;
}

const drawerWidth = 280;
const drawerCollapsedWidth = 60;

export function Sidebar({ isOpen = true, onToggle, onNewChat }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Load conversation history from localStorage (persistent frontend storage)
  useEffect(() => {
    try {
      const history = localStorage.getItem('mental-health-chat-sessions');
      if (history) {
        const parsedHistory = JSON.parse(history);
        setConversationHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      localStorage.removeItem('mental-health-chat-sessions');
    }
  }, []);

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
    // Create new conversation session with timestamp
    const newConversationId = `session-${Date.now()}`;
    const updatedHistory = [newConversationId, ...conversationHistory.slice(0, 19)]; // Keep last 20 sessions
    setConversationHistory(updatedHistory);
    
    try {
      localStorage.setItem('mental-health-chat-sessions', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving conversation sessions:', error);
    }
  };

  const formatConversationTitle = (id: string) => {
    const timestamp = id.replace('session-', '');
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return `Just now`;
    } else if (days === 0) {
      if (hours === 1) {
        return `1 hour ago`;
      } else {
        return `${hours} hours ago`;
      }
    } else if (days === 1) {
      return `Yesterday`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
          }}
          onClick={onToggle}
        />
      )}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isOpen}
        onClose={onToggle}
        sx={{
          width: isOpen ? drawerWidth : drawerCollapsedWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isOpen ? drawerWidth : drawerCollapsedWidth,
            boxSizing: "border-box",
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isOpen ? 'space-between' : 'center',
          p: 1,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Collapse in={isOpen} orientation="horizontal">
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', ml: 1 }}>
              Conversations
            </Typography>
          </Collapse>
          <IconButton 
            onClick={onToggle}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        {/* New Chat Button */}
        <Box sx={{ p: isOpen ? 2 : 1 }}>
          <Button
            variant="contained"
            fullWidth={isOpen}
            onClick={handleNewChat}
            startIcon={isOpen ? <AddIcon /> : null}
            sx={{
              borderRadius: 3,
              fontWeight: 600,
              minWidth: isOpen ? 'auto' : 40,
              minHeight: 40,
              px: isOpen ? 2 : 0,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 4,
              },
            }}
          >
            {isOpen ? 'New Chat' : <AddIcon />}
          </Button>
        </Box>

        <Divider />

        {/* Conversation History */}
        <List sx={{ flex: 1, pt: 1 }}>
          {conversationHistory.length > 0 ? (
            conversationHistory.map((chatId, index) => (
              <ListItem key={chatId} disablePadding sx={{ px: isOpen ? 1 : 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: isOpen ? 2 : '50%',
                    minHeight: 48,
                    minWidth: isOpen ? 'auto' : 48,
                    px: isOpen ? 2 : 0,
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <ChatIcon sx={{ 
                    color: 'primary.main', 
                    mr: isOpen ? 1.5 : 0,
                    fontSize: 20,
                  }} />
                  <Collapse in={isOpen} orientation="horizontal">
                    <ListItemText 
                      primary={formatConversationTitle(chatId)}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        noWrap: true,
                      }}
                    />
                  </Collapse>
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ px: isOpen ? 2 : 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isOpen ? 'column' : 'row',
                alignItems: 'center', 
                textAlign: 'center',
                width: '100%',
                opacity: 0.6,
              }}>
                <HistoryIcon sx={{ 
                  color: 'text.secondary', 
                  mb: isOpen ? 1 : 0,
                  mr: isOpen ? 0 : 1,
                }} />
                <Collapse in={isOpen} orientation="horizontal">
                  <Typography variant="body2" color="text.secondary">
                    No conversations yet
                  </Typography>
                </Collapse>
              </Box>
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}
