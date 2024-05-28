import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { Box, BoxProps, Button, ButtonProps, Grid, Typography } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FeatureBoxProps = PropsWithChildren &
    BoxProps & {
        selected: boolean;
    };

function FeatureBox(props: FeatureBoxProps) {
    const { selected, children } = props;
    return (
        <Box
            component={'button'}
            sx={{
                display: 'flex',
                height: '100%',
                border: 1,
                borderRadius: 3,
                // mx: 1,
                p: 3,
                borderColor: 'grey.300',
                bgcolor: selected ? '#e3f2fd' : 'inherit',
                '&:hover': {
                    borderColor: '#bbdefb',
                    bgcolor: '#CFE5FD',
                },
                cursor: 'pointer',
            }}
        >
            {children}
        </Box>
    );
}

export function Features() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { t } = useTranslation();

    return (
        <Box
            id="features"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                my: 1,
                p: 1,
                display: 'flex',
                flex: 1,
                height: '100%',
                gap: 4,
            }}
        >
            <Box
                id="features-left"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    flex: 1,
                    // p: 1,
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        gap: 2,
                    }}
                >
                    <Typography variant="h1">{t('Main features')}</Typography>
                    <Typography color="grey.700">
                        Нарахування заробітної плати для підприємств малого та середнього бізнесу.
                        <br />
                        Автоматизоване створення розрахункових документів згідно з розкладом
                        бізнес-процесів.
                    </Typography>
                </Box>
                <FeatureBox
                    selected={selectedIndex === 0}
                    onClick={() => {
                        alert('0');
                        setSelectedIndex(0);
                    }}
                >
                    <Box sx={{ display: 'flex', height: '100%', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                            <BusinessCenterOutlined color="primary" />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500 }} align="left">
                                {t('Employer')}
                            </Typography>
                            <Typography align="left" color="grey.700">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, rem
                                velit, animi quisquam mollitia temporibus quod illum sapiente
                                voluptate, eos tempora in cum nemo numquam consequatur error! Quas,
                                ab culpa!
                            </Typography>
                        </Box>
                    </Box>
                </FeatureBox>
                <FeatureBox
                    selected={selectedIndex === 1}
                    onClick={() => {
                        alert('1');
                        setSelectedIndex(1);
                    }}
                >
                    <Box sx={{ display: 'flex', height: '100%', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                            <PeopleOutlined color="primary" />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500 }} align="left">
                                {t('Employee')}
                            </Typography>
                            <Typography align="left" color="grey.700">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, rem
                                velit, animi quisquam mollitia temporibus quod illum sapiente
                                voluptate, eos tempora in cum nemo numquam consequatur error! Quas,
                                ab culpa!
                            </Typography>
                        </Box>
                    </Box>
                </FeatureBox>
                <FeatureBox
                    selected={selectedIndex === 2}
                    onClick={() => {
                        alert('0');
                        setSelectedIndex(2);
                    }}
                >
                    <Box sx={{ display: 'flex', height: '100%', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                            <Settings color="primary" />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500 }} align="left">
                                {t('Administrator')}
                            </Typography>
                            <Typography align="left" color="grey.700">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, rem
                                velit, animi quisquam mollitia temporibus quod illum sapiente
                                voluptate, eos tempora in cum nemo numquam consequatur error! Quas,
                                ab culpa!
                            </Typography>
                        </Box>
                    </Box>
                </FeatureBox>
            </Box>
            <Box
                id="features-right"
                sx={{
                    height: '100%',
                    flex: 1,
                    border: 1,
                    borderRadius: 3,
                    // mx: 1,
                    p: 1,
                    borderColor: 'grey.300',
                    bgcolor: 'grey.50',
                }}
            >
                <Box>Description</Box>
            </Box>
        </Box>
    );
}
