import { selectCompany } from '@/store/slices/companySlice';
import { useAppSelector } from '@/store/store.hooks';
import { Select, SelectProps } from '@mui/material';
import { PayPeriod } from '@repo/openapi';
import { monthBegin } from '@repo/shared';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';
import { InputLabel } from '../layout/InputLabel';
import { useOptions } from './SelectAccPeriod.hooks';

type Props = SelectProps<string> & {
    data: PayPeriod[];
    control: any;
    label?: string;
    id?: string;
    name: string;
    disabled?: boolean;
};

export default function SelectAccPeriodForm(props: Props) {
    const { data, control, label, id, name, disabled, ...other } = props;
    const company = useAppSelector(selectCompany);
    const options = useOptions(data, company?.payPeriod ?? monthBegin(new Date()));

    return (
        <>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { value } }) => {
                    return (
                        <Select
                            disabled={!!disabled}
                            size="small"
                            margin="none"
                            fullWidth
                            native={false}
                            onChange={(event: any) => new Date(event.target.value)}
                            value={options?.length ? format(value || monthBegin(new Date()), 'yyyy-MM-dd') : ''}
                            {...other}
                            label={''}
                        >
                            {options}
                        </Select>
                    );
                }}
            />
        </>
    );
}
