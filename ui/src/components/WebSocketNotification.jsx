import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Slide, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { WS_URL } from '../config';
import { 
  wsNotificationPaper,
  wsSocketNotificationHeader,
  wsNotificationheaderInner, 
  wsNotificationText,
  wsNotificationBox,
  wsNotificationIconButton,
  wsNotificationTimestamp
} from './sxModules';

export default function WebSocketNotification() {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/ws/news`);
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.is_new) {
          setNotification(data);
          setVisible(true);
          
          setTimeout(() => {
            setVisible(false);
          }, 8000);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Slide direction="left" in={visible} mountOnEnter unmountOnExit timeout={{ enter: 400, exit: 300 }}>
        <Fade in={visible} timeout={{ enter: 500, exit: 200 }}>
          <Paper elevation={3} sx={wsNotificationPaper}>
            <Box sx={wsNotificationBox}>
              <Box sx={wsSocketNotificationHeader}>
                {notification && 
                  <Typography variant="caption" component="div" color="text.secondary" sx={wsNotificationheaderInner}>
                    {notification.channel}
                  </Typography>}
                  <IconButton size="small" onClick={() => setVisible(false)} sx={wsNotificationIconButton}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
              </Box>
              {notification && (
                <>
                  <Typography variant="body2" color="text.primary" sx={wsNotificationText}>
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={wsNotificationTimestamp}>
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Fade>
      </Slide>
    </>
  );
}