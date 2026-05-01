import { memo, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import ElementCard from './ElementCard';
import { ELEMENTS } from '../data';

// Build grid positions once at module load — single pass
const GRID_POSITIONS = {};
ELEMENTS.forEach(el => {
  const [num, , , , cat, period, group] = el;
  if (cat === 'lanthanide') {
    GRID_POSITIONS[num] = { row: 9, col: num - 57 + 4 };
  } else if (cat === 'actinide') {
    GRID_POSITIONS[num] = { row: 10, col: num - 89 + 4 };
  } else {
    GRID_POSITIONS[num] = { row: period, col: group };
  }
});

const ElementGrid = memo(function ElementGrid({ search, activeCat, onElementClick }) {
  const searchLower = search.toLowerCase();

  const elementStates = useMemo(() => {
    return ELEMENTS.map(el => {
      const [num, sym, name, , cat] = el;
      const matchesSearch = !search || sym.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower) || String(num).includes(search);
      const matchesCat = !activeCat || cat === activeCat;
      return {
        el,
        dimmed: (search && !matchesSearch) || (activeCat && !matchesCat),
        highlighted: matchesSearch && matchesCat && (!!search || !!activeCat),
      };
    });
  }, [search, searchLower, activeCat]);

  const handleClick = useCallback((el) => {
    onElementClick(el);
  }, [onElementClick]);

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
      {elementStates.map(({ el, dimmed, highlighted }) => {
        const pos = GRID_POSITIONS[el[0]];
        if (!pos) return null;
        return (
          <Box key={el[0]} sx={{ gridColumn: pos.col, gridRow: pos.row }}>
            <ElementCard
              element={el}
              dimmed={dimmed}
              highlighted={highlighted}
              onClick={() => handleClick(el)}
            />
          </Box>
        );
      })}
    </Box>
  );
});

export default ElementGrid;
