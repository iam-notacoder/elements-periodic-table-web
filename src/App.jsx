import { useState, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, TextField, InputAdornment, Box,
  ToggleButtonGroup, ToggleButton, Chip, Stack, Container,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableChartIcon from '@mui/icons-material/TableChart';
import ListIcon from '@mui/icons-material/List';
import ElementGrid from './components/ElementGrid';
import ElementList from './components/ElementList';
import ElementModal from './components/ElementModal';
import { CATEGORIES } from './data';

const CATEGORY_ENTRIES = Object.entries(CATEGORIES);

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [view, setView] = useState('table');
  const [selectedElement, setSelectedElement] = useState(null);

  const handleCatClick = useCallback((cat) => {
    setActiveCat(prev => prev === cat ? null : cat);
  }, []);

  const handleViewChange = useCallback((_, v) => { if (v) setView(v); }, []);
  const handleSearch = useCallback((e) => setSearch(e.target.value), []);
  const handleCloseModal = useCallback(() => setSelectedElement(null), []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ flexShrink: 0 }}>
            Periodic Table
          </Typography>
          <TextField
            size="small"
            placeholder="Search elements…"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
            sx={{
              flex: 1, minWidth: 160, maxWidth: 320,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.15)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
              },
              '& input': { color: 'white' },
              '& .MuiInputAdornment-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}
          >
            <ToggleButton value="table" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white' } }}>
              <TableChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white' } }}>
              <ListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      {/* Category filter chips */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', overflowX: 'auto' }}>
        <Stack direction="row" spacing={0.75} sx={{ px: 2, py: 1, width: 'max-content' }}>
          {CATEGORY_ENTRIES.map(([key, { label, color }]) => (
            <Chip
              key={key}
              label={label}
              size="small"
              onClick={() => handleCatClick(key)}
              variant={activeCat === key ? 'filled' : 'outlined'}
              sx={{
                borderColor: color,
                color: activeCat === key ? 'white' : color,
                bgcolor: activeCat === key ? color : 'transparent',
                '&:hover': { bgcolor: `${color}20` },
                cursor: 'pointer',
                fontSize: 11,
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: { xs: 1, sm: 2 }, overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        {view === 'table' ? (
          <ElementGrid
            search={search}
            activeCat={activeCat}
            onElementClick={setSelectedElement}
          />
        ) : (
          <Container maxWidth="sm" disableGutters>
            <ElementList
              search={search}
              activeCat={activeCat}
              onElementClick={setSelectedElement}
            />
          </Container>
        )}
      </Box>

      <ElementModal element={selectedElement} onClose={handleCloseModal} />
    </Box>
  );
}
