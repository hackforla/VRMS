import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

/**
 * Renders a titled box component with optional badge and children content.
 * @param {Object} props - The props object.
 * @param {string} props.title - The title to display in the box header.
 * @param {React.ReactNode} props.children - The content to render inside the box.
 * @param {React.ReactNode} [props.badge] - Optional badge element to display in the header.
 * @param {Object} [props.childrenBoxSx] - Optional sx props for the children container.
 * @returns {JSX.Element} The rendered TitledBox component.
 */
export default function TitledBox({ title, children, badge, childrenBoxSx }) {
  return (
    <Box sx={{ bgcolor: '#F5F5F5', my: 3 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
            {title}
          </Typography>
        </Box>
        {badge ? badge : ' '}
      </Box>
      <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
      <Box sx={{ py: 2, px: 4, ...childrenBoxSx }}>{children}</Box>
    </Box>
  );
}
