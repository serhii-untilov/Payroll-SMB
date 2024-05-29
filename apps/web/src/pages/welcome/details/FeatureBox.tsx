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
                border: 1,
                borderRadius: 3,
                // mx: 1,
                p: 2,
                borderColor: 'grey.300',
                bgcolor: index === selectedIndex ? '#e3f2fd' : 'inherit',
                '&:hover': {
                    borderColor: '#bbdefb',
                    bgcolor: '#CFE5FD',
                },
                cursor: 'pointer',
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
                    <Typography align="left" color="grey.700">
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
