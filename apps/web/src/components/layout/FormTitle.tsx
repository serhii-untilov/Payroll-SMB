import { Typography, TypographyProps } from '@mui/material';

type FormTitleProps = TypographyProps & {
    title: string;
};

export function FormTitle(props: FormTitleProps) {
    const { title } = props;

    return (
        <>
            <Typography
                component="h3"
                variant="h3"
                noWrap
                color="primary.dark"
                align="center"
                {...props}
            >
                {title}
            </Typography>
        </>
    );
}
