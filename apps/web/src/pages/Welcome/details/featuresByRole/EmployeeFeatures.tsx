import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    embedded?: boolean;
};

export default function EmployeeFeatures({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const featureList = useMemo(
        () => [
            t('employeeDetailFeature1'),
            t('employeeDetailFeature2'),
            t('employeeDetailFeature3'),
            t('employeeDetailFeature4'),
            t('employeeDetailFeature5'),
            t('employeeDetailFeature6'),
            t('employeeDetailFeature7'),
        ],
        [t],
    );

    return (
        <>
            {!embedded && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        aria-label="Go Back"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <ArrowBackIosNewRounded />
                    </IconButton>
                    <Typography component="h2" color="primary.main" variant="h2" noWrap>
                        {t('Employee')}
                    </Typography>
                </Box>
            )}
            <Box sx={embedded ? {} : { p: 1 }}>
                <ul>
                    {featureList.map((item, index) => (
                        <li key={index}>
                            <Typography color={'text.secondary'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </>
    );
}
