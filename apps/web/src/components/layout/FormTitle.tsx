import { Typography, TypographyProps } from '@mui/material';

type Props = TypographyProps & {
    title: string;
};

export function FormTitle(props: Props) {
    const { title } = props;

    return (
        <>
            <Typography
                component="h3"
                variant="h3"
                noWrap
                color="primary.dark"
                align="center"
                sx={{ mb: 2 }}
                {...props}
            >
                {title}
            </Typography>
        </>
    );
}
