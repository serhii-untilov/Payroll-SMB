import { useEffect, useState } from 'react';
import { Typography, TypographyProps, useMediaQuery } from '@mui/material';

type PageTitleProps = TypographyProps & {
    title: string;
};

export function PageTitle(props: PageTitleProps) {
    const { title } = props;
    const [titleVisible, setTitleVisible] = useState(true);
    const matches = useMediaQuery('(min-width:900px)');

    useEffect(() => {
        setTitleVisible(!matches);
    }, [matches]);

    return (
        titleVisible && (
            <>
                <Typography
                    component="h2"
                    variant="h2"
                    noWrap
                    // color="primary.dark"
                    align="left"
                    sx={{ mb: 2 }}
                    {...props}
                >
                    {title}
                </Typography>
            </>
        )
    );
}
