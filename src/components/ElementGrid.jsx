import { Box } from '@mui/material';
import ElementCard from './ElementCard';
import { ELEMENTS } from '../data';

// Map element to its grid position
const GRID_POSITIONS = {};
ELEMENTS.forEach(el => {
  const [num, sym, name, mass, cat, period, group] = el;
  GRID_POSITIONS[num] = { row: period, col: group };
});

// Lanthanides (57-71) and Actinides (89-103) go on rows 9 and 10 (row 8 is spacer)
ELEMENTS.forEach(el => {
  const [num, sym, name, mass, cat, period, group] = el;
  if (cat === 'lanthanide') {
    GRID_POSITIONS[num] = { row: 9, col: num - 57 + 4 };
  } else if (cat === 'actinide') {
    GRID_POSITIONS[num] = { row: 10, col: num - 89 + 4 };
  }
});

export default function ElementGrid({ search, activeCat, onElementClick }) {
  const searchLower = search.toLowerCase();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(18, 52px)',
        gridAutoRows: '52px',
        gap: '3px',
        overflowX: 'auto',
        pb: 1,
      }}
    >
      {ELEMENTS.map(el => {
        const [num, sym, name, mass, cat] = el;
        const pos = GRID_POSITIONS[num];
        if (!pos) return null;

        const matchesSearch = !search || sym.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower) || String(num).includes(search);
        const matchesCat = !activeCat || cat === activeCat;

        const dimmed = (search && !matchesSearch) || (activeCat && !matchesCat);
        const highlighted = (search && matchesSearch) || (activeCat && matchesCat);

        return (
          <Box
            key={num}
            sx={{
              gridColumn: pos.col,
              gridRow: pos.row,
            }}
          >
            <ElementCard
              element={el}
              dimmed={dimmed && !(matchesSearch && matchesCat)}
              highlighted={highlighted && matchesSearch && matchesCat}
              onClick={() => onElementClick(el)}
            />
          </Box>
        );
      })}
    </Box>
  );
}
