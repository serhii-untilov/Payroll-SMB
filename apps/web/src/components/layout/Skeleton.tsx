import { Skeleton as MuiSkeleton, SkeletonProps } from '@mui/material';
import { grey } from '@mui/material/colors';

export function Skeleton(props?: SkeletonProps) {
    return (
        <MuiSkeleton
            variant="rounded"
            width={'100%'}
            height={42}
            animation={false}
            sx={{ backgroundColor: grey[100] }}
            {...props}
        />
    );
}
