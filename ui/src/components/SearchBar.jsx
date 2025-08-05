import React from 'react';
import { Box, Paper, InputBase, Button } from '@mui/material';
import {
  searchBarContainer,
  searchBarPaper,
  searchBarInput,
  searchBarClearButton,
  searchBarSubmitButton
} from './sxModules';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <Box sx={searchBarContainer}>
      <Paper
        component="form"
        sx={searchBarPaper}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <InputBase
          sx={searchBarInput}
          placeholder="Search news articles across the globe..."
          value={searchTerm}
          onChange={(e) => {
            console.log(e.target.value);
            setSearchTerm(e.target.value);
          }}
          inputProps={{ 'aria-label': 'search news articles' }}
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={searchBarClearButton}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        
        <Button 
          type="submit" 
          sx={searchBarSubmitButton}
        >
          Search
        </Button>
      </Paper>
    </Box>
  );
};

export default SearchBar;