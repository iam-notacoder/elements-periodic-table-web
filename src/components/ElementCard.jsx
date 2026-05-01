import { memo } from 'react';
import { Card, CardActionArea, Typography, Box } from '@mui/material';
import { CATEGORIES, STATE_ICONS } from '../data';

const ElementCard = memo(function ElementCard({ element, dimmed, highlighted, onClick }) {
  const [num, sym, name, mass, cat] = element;
  const color = CATEGORIES[cat]?.color ?? '#546e7a';
  const catLabel = CATEGORIES[cat]?.label ?? cat;
  const state = element[8];
  const stateIcon = STATE_ICONS[state] ?? '';

  return (
    <Card
      elevation={highlighted ? 4 : 1}
      sx={{
        width: 52,
        height: 52,
        border: `1.5px solid ${color}`,
        borderRadius: 1,
        opacity: dimmed ? 0.25 : 1,
        transition: 'opacity 0.25s, box-shadow 0.2s',
        position: 'relative',
        bgcolor: highlighted ? `${color}18` : 'background.paper',
        '&:hover': { boxShadow: `0 0 0 2px ${color}` },
      }}
    >
      <CardActionArea
        onClick={onClick}
        aria-label={`${name}, element ${num}, ${catLabel}`}
        sx={{ height: '100%', p: '2px 3px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography aria-hidden="true" sx={{ fontSize: 9, color: 'text.secondary', lineHeight: 1 }}>{num}</Typography>
          <Typography component="span" role="img" aria-label={state ?? 'unknown state'} sx={{ fontSize: 8, lineHeight: 1 }}>
            {stateIcon}
          </Typography>
        </Box>
        <Typography aria-hidden="true" sx={{ fontSize: 16, fontWeight: 700, color, lineHeight: 1, alignSelf: 'center' }}>
          {sym}
        </Typography>
        <Box aria-hidden="true" sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 6.5, textAlign: 'center', lineHeight: 1, color: 'text.primary', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: 6, textAlign: 'center', color: 'text.secondary', lineHeight: 1.2 }}>
            {typeof mass === 'number' ? mass.toFixed(3) : mass}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
});

export default ElementCard;
