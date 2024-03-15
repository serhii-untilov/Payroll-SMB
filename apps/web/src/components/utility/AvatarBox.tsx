import { CameraAltRounded } from '@mui/icons-material';
import { Box } from '@mui/material';

export function AvatarBox() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                width: 180,
                height: 180,
                color: (theme) => theme.palette.grey[500],
                '& > :not(style)': {
                    m: 1,
                    width: 80,
                    height: 80,
                },
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: '25px',
                border: '1px solid lightgray',
            }}
        >
            <CameraAltRounded />
        </Box>
    );
}
