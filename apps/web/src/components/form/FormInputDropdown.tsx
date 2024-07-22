import { InputLabel } from '@/components/layout/InputLabel';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { Controller } from 'react-hook-form';

type Option = {
    label: string;
    value: any;
};

type Props = SelectProps & {
    name: string;
    control: any;
    label: string;
    options: Option[];
};

export const FormInputDropdown: React.FC<Props> = (props: Props) => {
    const { options, label } = props;

    const generateOptions = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };

    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Select
                        size="small"
                        margin="none"
                        fullWidth
                        error={!!error}
                        onChange={onChange}
                        value={value || ''}
                        {...props}
                        label={''}
                    >
                        {generateOptions()}
                    </Select>
                )}
            />
        </>
    );
};
