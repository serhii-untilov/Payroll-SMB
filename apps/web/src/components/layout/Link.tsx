import { Link as MuiLink } from '@mui/material';
import * as React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const LinkComponent = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
    return <RouterLink ref={ref} {...props} role={undefined} />;
});

export function Link(props: RouterLinkProps) {
    const { children } = props;

    return (
        <MuiLink component={LinkComponent} {...props}>
            {children}
        </MuiLink>
    );
}
