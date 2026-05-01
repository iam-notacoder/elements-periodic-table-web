import { memo, useMemo } from 'react';
import {
  List, ListItem, ListItemButton, ListItemText, Typography, Box,
} from '@mui/material';
import { ELEMENTS, CATEGORIES, STATE_ICONS } from '../data';

const ElementList = memo(function ElementList({ search, activeCat, onElementClick }) {
  const searchLower = search.toLowerCase();

  const grouped = useMemo(() => {
    const filtered = ELEMENTS.filter(el => {
      const [num, sym, name, , cat] = el;
      const matchesSearch = !search || sym.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower) || String(num).includes(search);
      const matchesCat = !activeCat || cat === activeCat;
      return matchesSearch && matchesCat;
    });

    const groups = {};
    filtered.forEach(el => {
      const cat = el[4];
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(el);
    });
    return groups;
  }, [search, searchLower, activeCat]);

  const entries = Object.entries(grouped);

  if (entries.length === 0) {
    return <Typography color="text.secondary" sx={{ p: 2 }}>No elements match your search.</Typography>;
  }

  return (
    <Box>
      {entries.map(([cat, els]) => (
        <Box key={cat} sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              px: 2, py: 0.5, fontWeight: 700,
              color: CATEGORIES[cat]?.color ?? 'text.primary',
              bgcolor: `${CATEGORIES[cat]?.color ?? '#888'}18`,
              borderLeft: `4px solid ${CATEGORIES[cat]?.color ?? '#888'}`,
            }}
          >
            {CATEGORIES[cat]?.label ?? cat}
          </Typography>
          <List dense disablePadding>
            {els.map(el => {
              const [num, sym, name, mass, , , , , state] = el;
              return (
                <ListItem key={num} disablePadding divider>
                  <ListItemButton onClick={() => onElementClick(el)} sx={{ py: 1 }}>
                    <Box sx={{ width: 36, textAlign: 'center', mr: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" display="block">{num}</Typography>
                      <Typography fontWeight={700} sx={{ color: CATEGORIES[el[4]]?.color }}>{sym}</Typography>
                    </Box>
                    <ListItemText
                      primary={name}
                      secondary={`${typeof mass === 'number' ? mass.toFixed(3) : mass} u · ${STATE_ICONS[state] ?? ''} ${state}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
});

export default ElementList;
