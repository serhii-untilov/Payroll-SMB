import { CameraAltRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../layout/Tooltip';

export function AvatarBox() {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                width: 140,
                height: 140,
                color: (theme) => theme.palette.grey[500],
                '& > :not(style)': {
                    m: 1,
                    width: 80,
                    height: 80,
                },
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: '25px',
                border: '1px solid lightgray',
                cursor: 'pointer',
            }}
        >
            <Tooltip placement="right" title={t('Upload photo')}>
                <CameraAltRounded />
            </Tooltip>
        </Box>
    );
}
