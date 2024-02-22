import { Box } from '@mui/material';
import Avvvatars from 'avvvatars-react';

export function AvatarGenerator(props: { value: string | undefined }) {
    const { value } = props;
    return <Avvvatars style="shape" size={180} radius={25} value={value || ''} />;
}
