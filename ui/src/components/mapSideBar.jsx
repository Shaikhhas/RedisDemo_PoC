import React, { useState } from "react";
import { 
  Box, 
  Typography as MuiTypography, 
  IconButton, 
  Divider, 
  CircularProgress,
  Paper
} from '@mui/material';

import ArticleCard from './ArticleCard';
import SimilarStoriesModal from './SimilarStoriesModal';
import {
  mapSideBarPaper,
  mapSideBarHeader,
  mapSideBarTitle,
  mapSideBarCloseButton,
  mapSideBarCloseIcon,
  mapSideBarDivider,
  mapSideBarContent,
  mapSideBarLoadingBox,
  mapSideBarLoadingSpinner,
  mapSideBarArticleBox,
  mapSideBarEmptyState
} from './sxModules';

export default function MapSideBar({ sidebarOpen, setSidebarOpen, selectedCountry, countryArticles, countryLoading }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);

    const handleSimilarClick = (articleId) => {
        setSelectedArticleId(articleId);
        setModalOpen(true);
    };

    return (
        <>
            <Paper
                elevation={6}
                sx={mapSideBarPaper(sidebarOpen)}
                onClick={(e) => e.stopPropagation()}
            >
                <Box sx={mapSideBarHeader}>
                    <MuiTypography variant="h5" component="h2" sx={mapSideBarTitle}>
                    {selectedCountry ? `Articles in ${selectedCountry}` : 'News Articles'}
                    </MuiTypography>
                    
                    <IconButton
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                    size="large"
                    sx={mapSideBarCloseButton}
                    >
                    <span style={mapSideBarCloseIcon}>&times;</span>
                    </IconButton>
                </Box>
                
                <Divider sx={mapSideBarDivider} />

                {selectedCountry ? (
                <Box sx={mapSideBarContent}>

                { countryLoading ? (
                    <Box sx={mapSideBarLoadingBox}>
                        <CircularProgress size={36} sx={mapSideBarLoadingSpinner} />
                        <MuiTypography variant="body2" color="text.secondary">
                        Loading articles for {selectedCountry}...
                        </MuiTypography>
                    </Box>
                    ) : countryArticles.map(article => {
                    
                    return (
                    <Box 
                        key={article.id}
                        sx={mapSideBarArticleBox}
                    >
                        <ArticleCard 
                        article={{
                            news_articleid: article.id,
                            news_title: article.text.split('\n')[0] || article.text.substring(0, 60),
                            news_description: article.text,
                            news_source: article.channel,
                            news_publishedAt: new Date(article.timestamp * 1000).toLocaleString()
                            
                        }}
                        onSimilarClick={handleSimilarClick}
                        />
                    </Box>
                    );
                })}
                </Box>
                ) : (
                    <Box sx={mapSideBarEmptyState}>
                    <MuiTypography variant="body1" color="text.secondary" align="center">
                        Click a country on the map to see related articles.
                    </MuiTypography>
                    </Box>
                )}
            </Paper>

            <SimilarStoriesModal 
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                articleId={selectedArticleId}
            />
        </>
    )
}