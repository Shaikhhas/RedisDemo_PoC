import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import { articleCardStyle,articleDescStyle,articleBoxStyle, articleSimilarStyle } from './sxModules.jsx';

export default function ArticleCard({ article, onSimilarClick }) {
  return (
    <Card sx={articleCardStyle}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {article.news_title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={articleDescStyle}>
          {article.news_description}
        </Typography>
        <Box sx={articleBoxStyle}>
          <span>{article.news_source}</span>
          <span>{article.news_publishedAt}</span>
        </Box>
        <Box sx={articleSimilarStyle}>
          <Button size="small" onClick={() => {onSimilarClick(article.news_articleid);}} sx={{ fontSize: '0.75rem' }} >
            Similar Stories
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}