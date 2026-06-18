import React, { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Renders a titled box component with optional badge and children content. Can be configured as an expandable accordion.
 * @param {Object} props - The props object.
 * @param {string} props.title - The title to display in the header.
 * @param {React.ReactNode} props.children - The content to render inside the box or accordion details.
 * @param {React.ReactNode} [props.badge] - Optional badge element to display in the header.
 * @param {Object} [props.childrenBoxSx] - Optional sx props for the children container.
 * @param {boolean} [props.expandable=false] - Whether the component should be an expandable accordion.
 * @returns {JSX.Element} The rendered TitledBox component.
 */
export default function TitledBox({
  title,
  children,
  badge,
  childrenBoxSx,
  expandable = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (expandable) {
    return (
      <Accordion
        sx={{ bgcolor: '#F5F5F5', my: 3 }}
        expanded={isExpanded}
        onChange={(event, expanded) => setIsExpanded(expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              {title}
            </Typography>
            <Box
              onClick={(e) => {
                if (isExpanded) e.stopPropagation();
              }}
            >
              {badge}
            </Box>
          </Box>
        </AccordionSummary>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <AccordionDetails>
          <Box sx={{ py: 2, px: 4, ...childrenBoxSx }}>{children}</Box>
        </AccordionDetails>
      </Accordion>
    );
  }

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
        {badge || ' '}
      </Box>
      <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
      <Box sx={{ py: 2, px: 4, ...childrenBoxSx }}>{children}</Box>
    </Box>
  );
}
