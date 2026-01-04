import { Box, Typography } from '@mui/material';
import UseCaseImage from './UseCaseImage';

const UseCaseCard = ({ item, index }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: index % 2 ? { xs: 'column', md: 'row-reverse' } : { xs: 'column', md: 'row' },
                gap: { xs: 2, md: 6 },
                borderRadius: 3,
                py: 3,
                px: 3,
                // From https://css.glass
                background: (theme) => (theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)'),
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                webkitBackdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                minHeight: 380,
                overflow: 'auto',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 4,
                    height: '100%',
                    justifyContent: 'center',
                    gap: 2,
                    px: 3,
                }}
            >
                <Typography variant="h3" color="primary">
                    {item.name}
                </Typography>
                {item.description.map((element, index) => {
                    return <Typography key={index}>{element}</Typography>;
                })}
            </Box>
            <UseCaseImage image={item.image} />
        </Box>
    );
};

export default UseCaseCard;
