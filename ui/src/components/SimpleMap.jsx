import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState, useRef} from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from "axios";
import { API_URL } from '../config';
import { normalizeCountries } from '../components/countryMapping';
import SearchBar from './SearchBar';
import { Box, Typography, CircularProgress, Fade, Backdrop } from '@mui/material';
import MapLegend from './mapLegend';
import MapTimeline from './mapTimeline';
import MapSideBar from './mapSideBar';
import WebSocketNotification from './WebSocketNotification';
import {
  mapContainerStyle,
  mapMainContainer,
  mapLoadingBackdrop,
  mapLoadingBox,
  mapLoadingSpinner,
  mapLoadingTitle,
  mapLoadingText,
  mapOverlay
} from './sxModules';

export default function SimpleMap() {
  const [geoJson, setGeoJson] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxZoom, setMaxZoom] = useState(6);
  const [countryArticles, setCountryArticles] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [articleCounts, setArticleCounts] = useState({});
  const searchTermRef = useRef('');
  
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);
  
  useEffect(() => {
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoJson(data);
      })
      .catch(err => console.error('Failed loading GeoJSON:', err));
  }, []);
  
  useEffect(() => {
    var articleCounts = {};
    for(var i = 0; i < timelineData.length; i++) {
      const hourData = timelineData[i].countries;
      Object.entries(hourData).forEach(([country, count]) => {
        articleCounts[country] = (articleCounts[country] || 0) + count;
      });
    }
    setArticleCounts(articleCounts);
  },[timelineData]);
  
  useEffect(() => {
    axios
      .get(`${API_URL}/newsV2/counts_by_hour_country`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const lastIndex = res.data.length - 1;
          setCurrentTimeIndex(lastIndex);
          const initialCounts = {};
          for (let i = 0; i <= lastIndex; i++) {
            const hourData = res.data[i].countries;
            Object.entries(hourData).forEach(([country, count]) => {
              initialCounts[country] = (initialCounts[country] || 0) + count;
            });
          }
          setArticleCounts(initialCounts);
          setTimelineData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching timeline data:", err);
      });
  }, []);
  
  useEffect(() => {
    function updateMaxZoom() {
      if (window.innerWidth < 640) {
        setMaxZoom(15); 
      } else {
        setMaxZoom(6);
      }
    }
    updateMaxZoom();

    window.addEventListener('resize', updateMaxZoom);
    return () => window.removeEventListener('resize', updateMaxZoom);
  }, []);
  
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  const updateMapDataForTimeline = (index) => {
    var articleCounts = {};
    
    if (timelineData.length > 0 && index >= 0) {
      for (let i = 0; i <= index; i++) {
        const hourData = timelineData[i].countries;
        const periodsFromCurrent = index - i;
        const baseWeight = 1.0;
        const decayFactor = 0.85;
        const weight = baseWeight * Math.pow(decayFactor, periodsFromCurrent);
        
        Object.entries(hourData).forEach(([country, count]) => {
          articleCounts[country] = (articleCounts[country] || 0) + (count * weight);
        });
      }
    }
    
    setArticleCounts(articleCounts);
  };
  
  const getColor = (count) => {
    if (!count || count < 0.5) return '#ccc';
    const normalizedCount = Math.min(count, 15);
    const intensity = Math.sqrt(normalizedCount / 15);
    if (intensity < 0.33) {
      const ratio = intensity / 0.33;
      const r = Math.round(204 + (255 - 204) * ratio);
      const g = Math.round(204 + (204 - 204) * ratio);
      const b = Math.round(204 + (0 - 204) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } 
    else if (intensity < 0.66) {
      const ratio = (intensity - 0.33) / 0.33;
      const r = 255;
      const g = Math.round(204 - (204 - 153) * ratio);
      const b = Math.round(0);
      return `rgb(${r}, ${g}, ${b})`;
    } 
    else {
      const ratio = (intensity - 0.66) / 0.34;
      const r = 255;
      const g = Math.round(153 - 153 * ratio);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  };
  const countryStyle = (feature) => {
  const name = feature.properties.name;
  let count = articleCounts[name] || 0;
  if (count === 0) {
    const normalizedCountry = Object.entries(normalizeCountries).find(
      ([, geo]) => geo === name
    );
    if (normalizedCountry) {
      count = articleCounts[normalizedCountry[0]] || 0;
    } else {
      // Try case variations as fallback
      count = articleCounts[name.toUpperCase()] || 
              articleCounts[name.toLowerCase()] || 0;
    }
  }

  return {
    fillColor: getColor(count),
    weight: 1,
    opacity: 1,
    color: '#555',
    fillOpacity: 0.7,
    className: 'country-polygon',
    fillTransition: '0.5s ease-in-out',
  };
  };
  const handleSearch = () => {
      axios
    .get(`${API_URL}/newsV2/counts_by_hour_country?query=${searchTerm}`)
    .then((res) => {
      setTimelineData(res.data);
    })
    .catch((err) => {
      console.error("Error fetching timeline data:", err);
    });
  }
const onEachCountry = React.useCallback((feature, layer) => {
  const name = feature.properties.name;
  
  layer.on({
    mouseover: () => {
      layer.bindTooltip(`${name}`, { sticky: true }).openTooltip();
      layer.setStyle({ weight: 2, color: '#000' });
    },
    mouseout: () => {
      layer.setStyle({ weight: 1, color: '#555' });
      layer.closeTooltip();
    },
    click: () => {
      setSelectedCountry(name);
      setSidebarOpen(true);
      setCountryLoading(true);
      
      let apiCountryName = name;
      
      const normalizedEntry = Object.entries(normalizeCountries).find(
        ([,geo]) => geo === name
      );
      
      if (normalizedEntry) {
        apiCountryName = normalizedEntry[0];
      }
      
      const currentSearchTerm = searchTermRef.current;
      let url = `${API_URL}/newsV2/country/${encodeURIComponent(apiCountryName)}`;

      if (currentSearchTerm && currentSearchTerm.trim() !== '') {
        url += `?query=${encodeURIComponent(currentSearchTerm.trim())}`;
      }
      axios
        .get(url)
        .then((res) => {
          setCountryArticles(res.data);
          setCountryLoading(false);
        })
        .catch((err) => {
          console.error(`Error fetching articles for ${name}:`, err);
          setCountryLoading(false);
        });
    }
  });
}, []);

  if (loading) {
    return (
      <Backdrop open={true} sx={mapLoadingBackdrop}>
        <Box sx={mapLoadingBox}>
          <CircularProgress size={60} thickness={4} sx={mapLoadingSpinner} />
          <Typography variant="h5" sx={mapLoadingTitle}>
            Loading News Data
          </Typography>
          <Typography variant="body1" sx={mapLoadingText}>
            Retrieving the latest news from around the world...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <>
      <div style={mapMainContainer}>
        <WebSocketNotification />
        <MapContainer 
          center={[20, 50]} 
          zoom={3} 
          minZoom={3} 
          maxZoom={maxZoom} 
          maxBounds={[[-85, -180],[85, 180]]}
          style={mapContainerStyle}
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoJson && (
            <GeoJSON data={geoJson} style={countryStyle} onEachFeature={onEachCountry} />
          )}
        </MapContainer>
      </div>
      
      {sidebarOpen && (
        <Fade in={sidebarOpen}>
          <Box onClick={() => setSidebarOpen(false)} sx={mapOverlay} />
        </Fade>
      )}
      
      <MapSideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCountry={selectedCountry}
        countryArticles={countryArticles}
        countryLoading={countryLoading}
      />
      
      {timelineData.length > 0 && (
        <MapTimeline
          timelineData={timelineData}
          currentTimeIndex={currentTimeIndex}
          setCurrentTimeIndex={setCurrentTimeIndex}
          updateMapDataForTimeline={updateMapDataForTimeline}
        />
      )}
      
      <MapLegend />
    </>
  );
}