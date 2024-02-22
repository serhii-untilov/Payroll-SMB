import { Typography, TypographyProps } from '@mui/material';

type PageTitleProps = TypographyProps & {
    title: string;
};

export function PageTitle(props: PageTitleProps) {
    const { title } = props;

    return (
        <>
            <Typography
                component="h2"
                variant="h2"
                noWrap
                // color="primary.dark"
                align="left"
                {...props}
            >
                {title}
            </Typography>
        </>
    );
}
