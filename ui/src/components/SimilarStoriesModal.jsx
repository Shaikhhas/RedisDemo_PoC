import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress, Divider, Card, CardContent, Link } from '@mui/material';
import axios from 'axios';
import { 
  similarDialogPaperProps,
  similarDialogTitle,
  similarDialogContent,
  similarLoadingBox,
  similarErrorText,
  similarEmptyText,
  similarCardStyle,
  similarArticleText,
  similarArticleMeta
} from './sxModules';
import { API_URL } from '../config';

export default function SimilarStoriesModal({ open, onClose, articleId }) {
  const [loading, setLoading] = useState(true);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && articleId) {
      setLoading(true);
      setError(null);
      axios.get(`${API_URL}/newsV2/similar/${articleId}`)
        .then(res => {
          setSimilarArticles(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching similar articles:", err);
          setLoading(false);
        });
    }
  }, [open, articleId]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{ sx: similarDialogPaperProps }}
    >
      <DialogTitle sx={similarDialogTitle}>
        <Typography component="div" variant="h6">Similar Stories</Typography>
        <IconButton onClick={onClose} size="small">
          X
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={similarDialogContent}>
        {loading ? (
          <Box sx={similarLoadingBox}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={similarErrorText}>
            {error}
          </Typography>
        ) : similarArticles.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={similarEmptyText}>
            No similar stories found
          </Typography>
        ) : (
          <Box>
            {similarArticles.map((article) => (
              <Card
                key={article.id}
                variant="outlined"
                sx={similarCardStyle}
              >
                <CardContent>
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="inherit"
                  >
                    <Typography variant="subtitle1" component="div" gutterBottom fontWeight="medium">
                      {article.text.split('\n')[0] || article.text.substring(0, 80)}
                    </Typography>
                  </Link>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={similarArticleText}
                  >
                    {article.text}
                  </Typography>
                  
                  <Box sx={similarArticleMeta}>
                    <span>{article.channel}</span>
                    <span>
                      {new Date(article.timestamp * 1000).toLocaleString()}
                    </span>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}