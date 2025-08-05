import React from "react";
import { Box, Slider } from '@mui/material';
import {
  mapTimelineContainer,
  mapTimeIndicator,
  mapTimelineSlider,
  mapTimelineLabelContainer
} from './sxModules';

export default function MapTimeline({ timelineData, currentTimeIndex, setCurrentTimeIndex, updateMapDataForTimeline }) {
  return (
    <Box sx={mapTimelineContainer}>
      <Box
        sx={mapTimeIndicator}
        className="time-indicator"
      >
        {timelineData[currentTimeIndex] && new Date(timelineData[currentTimeIndex].hour).toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })}
      </Box>
      
      <Slider
        min={0}
        max={timelineData.length - 1}
        value={currentTimeIndex}
        onChange={(e, newIndex) => {
          setCurrentTimeIndex(newIndex);
          updateMapDataForTimeline(newIndex);
          const indicator = document.querySelector('.time-indicator');
          if (indicator) {
            indicator.style.opacity = 1;
            setTimeout(() => {
              indicator.style.opacity = 0;
            }, 2000);
          }
        }}
        size="small"
        sx={mapTimelineSlider}
      />
      
      <Box sx={mapTimelineLabelContainer}>
        <span>
          {timelineData[0] && new Date(timelineData[0].hour).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </span>
        <span>
          {timelineData[timelineData.length - 1] && new Date(timelineData[timelineData.length - 1].hour).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </Box>
    </Box>
  );
}