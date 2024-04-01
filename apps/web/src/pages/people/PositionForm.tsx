import { IPosition } from '@repo/shared';
import { Dispatch } from 'react';

export interface PositionFormParams {
    open: boolean;
    setOpen: Dispatch<boolean>;
    positionId: number | null;
    submitCallback?: Dispatch<IPosition>;
}

export function PositionForm(props: PositionFormParams) {
    return <></>;
}
