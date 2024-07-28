import useAppContext from '@/hooks/useAppContext';
import { Box, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import CompanySummary from './CompanySummary';
import WelcomeNewUser from './WelcomeNewUser';

const Summary = () => {
    const { company } = useAppContext();

    return (
        <Box
            component="section"
            sx={{
                borderRadius: '5px',
                my: { xs: 1, sm: 2 },
                mx: { xs: 1, sm: 2, md: 8, lg: 10, xl: 18 },
                py: { xs: 1, sm: 2 },
                px: { xs: 1, sm: 4 },
                color: (theme) => theme.palette.common.black,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : blue[50]),
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid grey' : ''),
            }}
        >
            <Grid container flexDirection="row">
                {company && <CompanySummary company={company} />}
                {!company && <WelcomeNewUser />}
            </Grid>
        </Box>
    );
};

export default Summary;
