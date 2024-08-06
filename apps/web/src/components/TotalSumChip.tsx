import { sumFormatter } from '@/utils/sumFormatter';
import { Chip } from '@mui/material';

type TotalSumChipProps = {
    sum: number;
    color: any;
};

export default function TotalSumChip(props: TotalSumChipProps) {
    return (
        <Chip
            label={sumFormatter(props.sum)}
            size={'medium'}
            color={props.color}
            sx={{
                display: 'inline',
                p: 0.5,
                ml: 1,
                fontSize: '1rem',
                color: (theme) => (theme.palette.mode === 'light' ? 'white' : 'black'),
            }}
        />
    );
}
