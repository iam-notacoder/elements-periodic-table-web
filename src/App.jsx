import { useState, useCallback, useMemo } from 'react';
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
import { CATEGORIES, ELEMENTS } from './data';

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

  const matchCount = useMemo(() => {
    const q = search.toLowerCase();
    return ELEMENTS.filter(([num, sym, name, , cat]) => {
      const matchesSearch = !search || sym.toLowerCase().includes(q) || name.toLowerCase().includes(q) || String(num).includes(search);
      const matchesCat = !activeCat || cat === activeCat;
      return matchesSearch && matchesCat;
    }).length;
  }, [search, activeCat]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Skip navigation link */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute', left: '-999px', top: 'auto', width: 1, height: 1, overflow: 'hidden',
          '&:focus': { left: 8, top: 8, width: 'auto', height: 'auto', zIndex: 9999, bgcolor: 'white', p: 1, borderRadius: 1 },
        }}
      >
        Skip to main content
      </Box>

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
            inputProps={{ 'aria-label': 'Search elements' }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" aria-hidden="true" /></InputAdornment>,
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
            aria-label="View mode"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}
          >
            <ToggleButton value="table" aria-label="Table view" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white' } }}>
              <TableChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white' } }}>
              <ListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>

      {/* Category filter */}
      <Box
        component="nav"
        aria-label="Filter by element category"
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', overflowX: 'auto' }}
      >
        <Stack direction="row" spacing={0.75} sx={{ px: 2, py: 1, width: 'max-content' }}>
          {CATEGORY_ENTRIES.map(([key, { label, color }]) => (
            <Chip
              key={key}
              label={label}
              size="small"
              onClick={() => handleCatClick(key)}
              role="button"
              aria-pressed={activeCat === key}
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

      {/* Screen reader live region for result count */}
      <Box
        aria-live="polite"
        aria-atomic="true"
        sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      >
        {(search || activeCat) ? `${matchCount} element${matchCount !== 1 ? 's' : ''} shown` : ''}
      </Box>

      {/* Main content */}
      <Box
        id="main-content"
        component="main"
        sx={{ p: { xs: 1, sm: 2 }, overflowX: 'auto', display: 'flex', justifyContent: 'center' }}
      >
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
