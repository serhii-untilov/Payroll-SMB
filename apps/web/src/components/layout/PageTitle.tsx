import { Typography, TypographyProps } from '@mui/material';
import useAppContext from '../../hooks/useAppContext';

type PageTitleProps = TypographyProps & {
    title: string;
};

export function PageTitle(props: PageTitleProps) {
    const { title } = props;

    return (
        <Typography
            component="h1"
            color="text.primary"
            variant="h1"
            noWrap
            align="left"
            sx={{ mb: 2, fontWeight: 500 }}
            {...props}
        >
            {title}
        </Typography>
    );
}
