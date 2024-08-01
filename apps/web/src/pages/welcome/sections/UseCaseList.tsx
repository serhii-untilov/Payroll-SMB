import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useUseCases from '../hooks/UseCases.hooks';
import UseCaseCard from './UseCaseCard';

export function UseCaseList() {
    const { t } = useTranslation();
    const { useCases } = useUseCases();

    return (
        <Box id="usage-scenarios" sx={{ display: 'flex', flexDirection: 'column', my: 5, gap: 2 }}>
            <Typography variant="h2" color={'text.primary'} sx={{ my: 3, textAlign: 'center' }}>
                {t('Usage scenarios')}
            </Typography>
            {useCases.map((item, index) => {
                return <UseCaseCard {...{ item, index }} />;
            })}
        </Box>
    );
}
