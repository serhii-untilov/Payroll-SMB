import useAppContext from '@/hooks/context/useAppContext';
import { ChevronRightRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    name: string;
    description: string[];
    icon: any;
    selectedIndex: number;
    index: number;
    onClick: (index: number) => void;
    details: string;
};

export function FeatureBox(props: Props) {
    const { themeMode } = useAppContext();
    const { name, description, icon, selectedIndex, index, onClick, details } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box
            onClick={() => {
                onClick(index);
            }}
            sx={{
                display: 'flex',
                height: '100%',
                borderRadius: 3,
                p: 2,
                borderColor: 'grey.300',
                cursor: 'pointer',
                /* From https://css.glass */
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                webkitBackdropFilter: 'blur(5px)',
                border:
                    index === selectedIndex
                        ? '1px solid white'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                bgcolor: {
                    xs: 'inherit',
                    sm: 'inherit',
                    md:
                        index === selectedIndex
                            ? themeMode === 'light'
                                ? '#e3f2fd'
                                : ''
                            : 'inherit',
                },
                '&:hover': {
                    xs: {},
                    sm: {},
                    md: {
                        border: '1px solid white',
                        bgcolor: themeMode === 'light' ? '#e3f2fd' : 'black',
                    },
                },
            }}
        >
            <Box sx={{ display: 'flex', height: '100%', gap: 1, width: '100%' }}>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        mx: 2,
                    }}
                >
                    {icon}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        height: '100%',
                        gap: 1,
                        width: '100%',
                    }}
                >
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 500 }} align="left">
                        {name}
                    </Typography>
                    <Box color={'text.primary'}>
                        <ul
                            style={{
                                padding: 0,
                                margin: 0,
                                textIndent: 0,
                                minHeight: 0,
                                overflow: 'auto',
                            }}
                        >
                            {description.map((item, index) => (
                                <li
                                    key={index + 1}
                                    style={{
                                        listStyleType: 'none',
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Box>
                    <Button
                        onClick={() => {
                            navigate(details);
                        }}
                        size="small"
                        endIcon={<ChevronRightRounded />}
                        sx={{
                            display: { xs: 'inline-flex', sm: 'inline-flex', md: 'none' },
                            alignSelf: 'flex-end',
                            m: 0,
                            p: 0,
                            textTransform: 'none',
                        }}
                    >
                        {t('Learn more')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
