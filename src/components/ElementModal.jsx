import { useEffect, useState, useRef } from 'react';
import {
  Dialog, DialogContent, DialogTitle, IconButton, Typography, Box,
  Chip, Divider, Grid, CircularProgress, useMediaQuery, useTheme, Drawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CATEGORIES, DISCOVERY } from '../data';

const STATE_LABELS = { Gas: '💨 Gas', Liquid: '💧 Liquid', Solid: '⬛ Solid', Unknown: '❓ Unknown' };

// Module-level image cache — persists for the session
const imgCache = new Map();

function DetailRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
      <Typography variant="body2" sx={{ textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}

export default function ElementModal({ element, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgUrl, setImgUrl] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (!element) return;

    const num = element[0];
    const name = element[2];

    if (imgCache.has(num)) {
      setImgUrl(imgCache.get(num));
      setImgLoading(false);
      return;
    }

    const controller = new AbortController();
    setImgUrl(null);
    setImgLoading(true);

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        const raw = d?.thumbnail?.source ?? null;
        // Only accept images from the expected Wikipedia media domain
        const url = (typeof raw === 'string' && raw.startsWith('https://upload.wikimedia.org/')) ? raw : null;
        imgCache.set(num, url);
        setImgUrl(url);
        setImgLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setImgLoading(false);
      });

    return () => controller.abort();
  }, [element]);

  if (!element) return null;

  const [num, sym, name, mass, cat, period, group, config, state, melt, boil, desc] = element;
  const color = CATEGORIES[cat]?.color ?? '#546e7a';
  const catLabel = CATEGORIES[cat]?.label ?? cat;
  const discovery = DISCOVERY[num];
  const massFormatted = typeof mass === 'number' ? mass.toFixed(3) : mass;
  const massDetailFormatted = typeof mass === 'number' ? `${mass.toFixed(4)} u` : mass;

  const content = (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
        <Box
          sx={{
            minWidth: 80, height: 80, border: `2px solid ${color}`, borderRadius: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            bgcolor: `${color}12`,
          }}
        >
          <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{num}</Typography>
          <Typography sx={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{sym}</Typography>
          <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{massFormatted}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{name}</Typography>
          <Chip label={catLabel} size="small" sx={{ mt: 0.5, bgcolor: `${color}20`, color }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{STATE_LABELS[state] ?? state}</Typography>
        </Box>
        {imgLoading && <CircularProgress size={60} />}
        {imgUrl && (
          <Box
            component="img"
            src={imgUrl}
            alt={name}
            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
          />
        )}
      </Box>

      {desc && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{desc}</Typography>
      )}

      <Divider sx={{ mb: 1.5 }} />

      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <DetailRow label="Atomic Number" value={num} />
          <DetailRow label="Atomic Mass" value={massDetailFormatted} />
          <DetailRow label="Period" value={period} />
          <DetailRow label="Group" value={group} />
          <DetailRow label="Electron Config" value={config} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailRow label="State (STP)" value={STATE_LABELS[state] ?? state} />
          <DetailRow label="Melting Point" value={melt != null ? `${melt} K` : null} />
          <DetailRow label="Boiling Point" value={boil != null ? `${boil} K` : null} />
          {discovery && <DetailRow label="Discovered by" value={discovery[0] ?? 'Ancient/Unknown'} />}
          {discovery && <DetailRow label="Year" value={discovery[1] ?? 'Unknown'} />}
        </Grid>
      </Grid>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={!!element} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px 16px 0 0', maxHeight: '85dvh' } }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{name}</Typography>
            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(85dvh - 60px)' }}>
            {content}
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!element} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {name}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}
