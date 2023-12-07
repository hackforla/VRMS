import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

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
                {badge}
            </Box>
            <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
            <Box sx={{ py: 2, px: 4, ...childrenBoxSx }}>{children}</Box>
        </Box>
    );


}