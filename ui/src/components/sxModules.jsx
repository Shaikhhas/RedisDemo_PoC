export const wsNotificationPaper =  { 
    position: 'fixed',
    top: '70px',
    right: '20px',
        width: '320px', 
        borderRadius: 2, 
        overflow: 'hidden', 
        zIndex: 1300, 
        borderLeft: '4px solid #2196f3', 
        bgcolor: '#fafafa' 
    };

export const wsSocketNotificationHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 };
export const wsNotificationheaderInner = { display: 'inline-block', bgcolor: 'rgba(0,0,0,0.04)', px: 1, py: 0.5, borderRadius: 1, mb: 1.5 };
export const wsNotificationText = {
    mb: 1, 
    lineHeight: 1.5, 
    maxHeight: '100px', 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical'
};

export const articleCardStyle= {
        maxWidth: 360,
        marginBottom: 2,
        cursor: 'pointer',
        ':hover': { boxShadow: 6 },
      }
export const articleDescStyle = {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }
export const articleBoxStyle = {
            mt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'gray',
          }
export const articleSimilarStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            pt: 1,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }

export const mapLegendBoxStyle = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        opacity: 0.7,
        transition: 'opacity 0.2s ease',
        '&:hover': {
          opacity: 0.9
        }
      }
export const mapLegendTypoStyle = {
          color: 'white',
          mb: 1,
          fontSize: '0.7rem',
          fontWeight: 'medium',
          display: 'block',
          textAlign: 'center'
        }

export const mapLegendGradientStyle = { 
        width: '140px', 
        height: '8px', 
        mb: 1,
        borderRadius: '4px',
        background: 'linear-gradient(to right, #ccc, #ffcc00, #ff9900, #ff0000)',
        overflow: 'hidden'
      }


export const similarDialogPaperProps = {
  borderRadius: 2,
  maxHeight: '80vh'
};

export const similarDialogTitle = {
  display: 'flex', 
  justifyContent: 'space-between',
  alignItems: 'center',
  pb: 1
};

export const similarDialogContent = { pt: 2 };

export const similarLoadingBox = { 
  display: 'flex', 
  justifyContent: 'center', 
  py: 4 
};

export const similarErrorText = { py: 3 };

export const similarEmptyText = { py: 3 };

export const similarCardStyle = { 
  mb: 2,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 1
  }
};

export const similarArticleText = { 
  mb: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical' 
};

export const similarArticleMeta = { 
  display: 'flex', 
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: 'text.secondary',
  mt: 1
};

export const wsNotificationBox = { p: 2 };

export const wsNotificationIconButton = { ml: 1 };

export const wsNotificationTimestamp = { 
  display: 'block', 
  textAlign: 'right', 
  mt: 1 
};

export const mapContainerStyle = { 
  height: "100vh", 
  width: "100%" 
};

export const mapMainContainer = { 
  height: '100vh', 
  width: '100vw', 
  position: 'relative', 
  zIndex: 1 
};

export const mapLoadingBackdrop = {
  zIndex: 9999,
  backgroundColor: 'rgba(18, 18, 18, 0.92)', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

export const mapLoadingBox = { 
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '500px',
  textAlign: 'center',
  p: 3,
  borderRadius: 2,
  bgcolor: '#1e1e1e',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
};

export const mapLoadingSpinner = { 
  mb: 3,
  color: '#2196f3'
};

export const mapLoadingTitle = { 
  mb: 2, 
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)'
};

export const mapLoadingText = { 
  color: 'rgba(255, 255, 255, 0.6)'
};

export const mapOverlay = {
  position: 'fixed',
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0,
  bgcolor: 'rgba(0,0,0,0.4)',
  zIndex: 999,
  cursor: 'pointer',
  transition: 'opacity 0.3s'
};

export const searchBarContainer = {
  position: 'fixed',
  top: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1100,
  width: '400px',
  maxWidth: '80%',
  transition: 'opacity 0.3s ease',
  opacity: 0.8,
  '&:hover': {
    opacity: 1
  }
};

export const searchBarPaper = {
  p: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: 2,
  borderRadius: 2,
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: 4
  }
};

export const searchBarInput = { 
  ml: 1, 
  flex: 1 
};

export const searchBarClearButton = {
  background: 'none',
  border: 'none',
  padding: '0 8px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#888',
  cursor: 'pointer',
};

export const searchBarSubmitButton = { 
  minWidth: 'auto',
  px: 2,
  color: 'white',
  backgroundColor: '#0066cc',
  borderRadius: '0 4px 4px 0',
  height: '100%',
  '&:hover': {
    backgroundColor: '#0055aa'
  }
};

export const mapTimelineContainer = {
  position: 'fixed',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '70%',
  maxWidth: '700px',
  zIndex: 1000,
  opacity: 0.6,
  transition: 'opacity 0.2s ease, transform 0.2s',
  padding: '5px 8px',
  borderRadius: '12px',
  backgroundColor: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateX(-50%) translateY(-2px)'
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export const mapTimeIndicator = {
  opacity: 0,
  transition: 'opacity 0.2s ease',
  mb: 0.5,
  bgcolor: 'rgba(0,0,0,0.6)',
  color: 'white',
  px: 1.5,
  py: 0.5,
  borderRadius: 1,
  fontSize: '0.7rem',
  pointerEvents: 'none',
  transform: 'translateY(5px)',
  '&:hover, :focus-within': {
    opacity: 1,
    transform: 'translateY(0)'
  }
};

export const mapTimelineSlider = {
  height: 3,
  width: '100%',
  padding: '2px 0',
  '& .MuiSlider-thumb': {
    width: 8,
    height: 8,
    transition: '0.2s',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px rgba(255, 255, 255, 0.16)'
    },
    '&:before': {
      display: 'none'
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#fff',
    height: 2,
  },
  '& .MuiSlider-track': {
    backgroundColor: '#fff',
    border: 'none',
    height: 2,
  },
  '&:hover': {
    '& .MuiSlider-thumb': {
      width: 12,
      height: 12,
    }
  }
};

export const mapTimelineLabelContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  px: 0.5,
  mt: 0.5,
  fontSize: '0.65rem',
  color: 'rgba(255,255,255,0.8)',
  opacity: 0.9
};


export const mapSideBarPaper = (sidebarOpen) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  width: {
    xs: '100%', 
    sm: '350px'  
  },
  bgcolor: 'background.paper',
  boxShadow: '-2px 0 8px rgba(0,0,0,0.2)',
  p: 3,
  transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
  transition: 'transform 0.3s ease-in-out',
  zIndex: 1000,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column'
});

export const mapSideBarHeader = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  mb: 2 
};

export const mapSideBarTitle = { 
  fontWeight: 'medium' 
};

export const mapSideBarCloseButton = { 
  p: 1 
};

export const mapSideBarCloseIcon = { 
  fontSize: '24px' 
};

export const mapSideBarDivider = { 
  mb: 2 
};

export const mapSideBarContent = { 
  mt: 1 
};

export const mapSideBarLoadingBox = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  py: 4 
};

export const mapSideBarLoadingSpinner = { 
  mb: 2 
};

export const mapSideBarArticleBox = { 
  mb: 2,
  transition: 'all 0.2s',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 2
  }
};

export const mapSideBarEmptyState = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  py: 4 
};

export const mapLegendLabelsStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  width: '100%',
  fontSize: '0.65rem',
  color: 'rgba(255,255,255,0.9)'
};