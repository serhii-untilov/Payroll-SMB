import { Typography, TypographyProps } from '@mui/material';

type PageTitleProps = TypographyProps & {
    title: string;
};

export function PageTitle(props: PageTitleProps) {
    const { title } = props;

    return (
        <Typography
            component="h2"
            color="text.primary"
            variant="h2"
            noWrap
            align="center"
            {...props}
        >
            {title}
        </Typography>
    );
}
