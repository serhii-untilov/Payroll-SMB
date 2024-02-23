import { Box } from '@mui/material';
import Avvvatars from 'avvvatars-react';

declare type Style = 'character' | 'shape';

export type AvatarGeneratorParams = {
    displayValue?: string;
    value?: string;
    size?: number;
    shadow?: boolean;
    style?: Style;
    border?: boolean;
    borderSize?: number;
    borderColor?: string;
    radius?: number;
};

export function AvatarGenerator(props: AvatarGeneratorParams) {
    const { value } = props;
    return <Avvvatars style="shape" size={180} radius={25} {...props} value={value || ''} />;
}
