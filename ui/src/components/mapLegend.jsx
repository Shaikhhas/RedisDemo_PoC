import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  mapLegendBoxStyle, 
  mapLegendTypoStyle, 
  mapLegendGradientStyle,
  mapLegendLabelsStyle 
} from './sxModules';

export default function MapLegend() {
  return (
    <Box sx={mapLegendBoxStyle}>
      <Typography variant="caption" sx={mapLegendTypoStyle}>News Activity</Typography>
      <Box sx={mapLegendGradientStyle} />
      
      <Box sx={mapLegendLabelsStyle}>
        <span>Low</span>
        <span>High</span>
      </Box>
    </Box>
  );
}