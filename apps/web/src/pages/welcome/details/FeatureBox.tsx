import { Box, Typography } from '@mui/material';

type Props = {
    name: string;
    description: string[];
    icon: any;
    selectedIndex: number;
    index: number;
    onClick: (index: number) => void;
};

export function FeatureBox(props: Props) {
    const { name, description, icon, selectedIndex, index, onClick } = props;
    return (
        <Box
            component={'button'}
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
                bgcolor: index === selectedIndex ? '#e3f2fd' : 'inherit',
                '&:hover': {
                    border: '1px solid white',
                    bgcolor: '#e3f2fd',
                },
            }}
        >
            <Box sx={{ display: 'flex', height: '100%', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>{icon}</Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        height: '100%',
                        gap: 1,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 500 }} align="left">
                        {name}
                    </Typography>
                    <Typography align="left" color={'grey.800'}>
                        <ul
                            style={{
                                padding: 0,
                                margin: 0,
                                textIndent: 0,
                            }}
                        >
                            {description.map((item) => (
                                <li
                                    style={{
                                        listStyleType: 'none',
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
