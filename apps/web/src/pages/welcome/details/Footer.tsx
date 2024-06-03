import { Box, IconButton, SvgIcon, Typography } from '@mui/material';
import { Link } from '../../../components/layout/Link';

export function Footer() {
    return (
        <Box
            id="footer"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                my: 3,
                p: 1,
                // mx: { sm: 8, md: 8, lg: 16, xl: 16 },
                borderRadius: 25,
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
            }}
        >
            <Box id="footer__left" sx={{ flex: 1, my: 'auto' }}>
                <Link to="https://untilov-com-ua.vercel.app/" target="_blank" rel="noreferrer">
                    <Typography sx={{ color: 'grey.700', display: 'inline' }}>
                        Copyright ©{' '}
                    </Typography>
                    <Typography sx={{ color: 'primary.main', display: 'inline' }}>
                        Serhii Untilov
                    </Typography>{' '}
                    <Typography sx={{ color: 'grey.700', display: 'inline' }}>
                        {new Date().getFullYear()}
                    </Typography>
                </Link>
            </Box>
            <Box
                id="footer__right"
                sx={{ display: 'flex', justifyContent: 'end', flex: 1, gap: 2 }}
            >
                <IconButton
                    id="github-button"
                    color="primary"
                    href="https://github.com/serhii-untilov/Payroll-SMB"
                    target="_blank"
                    rel="noreferrer"
                >
                    <SvgIcon>
                        <svg
                            width="98"
                            height="96"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 98 96"
                            strokeWidth={1.5}
                            // stroke="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                                // fill="#24292f"
                                fill="#616161"
                            />
                        </svg>
                    </SvgIcon>
                </IconButton>
                <IconButton
                    id="linkedin-button"
                    color="primary"
                    href="https://www.linkedin.com/in/serhiiuntilov/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <SvgIcon>
                        <svg
                            height="72"
                            viewBox="0 0 72 72"
                            width="72"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g fill="none" fill-rule="evenodd">
                                <path
                                    d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z"
                                    fill="#616161"
                                />
                                <path
                                    d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z"
                                    fill="#FFF"
                                />
                            </g>
                        </svg>
                    </SvgIcon>
                </IconButton>
                <IconButton
                    id="facebook-button"
                    color="primary"
                    href="https://www.facebook.com/s.untilov/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <SvgIcon>
                        <svg x="0px" y="0px" viewBox="0 0 40 40">
                            <path
                                fill="#616161"
                                d="M16.7,39.8C7.2,38.1,0,29.9,0,20C0,9,9,0,20,0s20,9,20,20c0,9.9-7.2,18.1-16.7,19.8l-1.1-0.9h-4.4L16.7,39.8z"
                            />
                            <path
                                fill="#FFFFFF"
                                d="M27.8,25.6l0.9-5.6h-5.3v-3.9c0-1.6,0.6-2.8,3-2.8h2.6V8.2c-1.4-0.2-3-0.4-4.4-0.4c-4.6,0-7.8,2.8-7.8,7.8V20
	h-5v5.6h5v14.1c1.1,0.2,2.2,0.3,3.3,0.3c1.1,0,2.2-0.1,3.3-0.3V25.6H27.8z"
                            />
                        </svg>
                    </SvgIcon>
                </IconButton>
            </Box>
        </Box>
    );
}
