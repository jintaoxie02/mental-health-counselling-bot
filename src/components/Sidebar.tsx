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
} from "@mui/material";

const drawerWidth = 240;

export function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" fullWidth>
          New Chat
        </Button>
      </Box>
      <Divider />
      <List>
        {/* This will be populated with chat history later */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Current Conversation" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
