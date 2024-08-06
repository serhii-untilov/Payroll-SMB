import Copyright from '@/components/Copyright';
import FacebookButton from '@/components/FacebookButton';
import GitHubButton from '@/components/GitHubButton';
import LinkedInButton from '@/components/LinkedInButton';
import { Box } from '@mui/material';

const Footer = () => {
    return (
        <Box id="footer" sx={{ maxWidth: 'lg', width: '100%', mt: 0, mb: 1 }}>
            <Box
                sx={{
                    mx: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                }}
            >
                <Box sx={{ flex: 1, my: 'auto' }}>
                    <Copyright />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', flex: 1, gap: 2 }}>
                    <GitHubButton />
                    <LinkedInButton />
                    <FacebookButton />
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
