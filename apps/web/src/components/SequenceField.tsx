import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { MAX_SEQUENCE_NUMBER } from '@repo/shared';
import { Controller } from 'react-hook-form';
import { InputLabel } from './layout/InputLabel';
import { useTranslation } from 'react-i18next';

type Props = OutlinedInputProps & {
    id?: string;
    name?: string;
    control: any;
    label?: string;
    rules?: any;
    autoFocus?: boolean;
    step?: number;
    min?: number;
    max?: number;
};

export default function SequenceField(props: Props) {
    const { id, label, step, min, max, name, control, rules, autoFocus, ...other } = props;
    const { t } = useTranslation();
    return (
        <>
            <InputLabel>{label ?? t('Sequence Number')}</InputLabel>
            <Controller
                name={props.name ?? 'sequenceNumber'}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <OutlinedInput
                        autoFocus={props?.autoFocus}
                        size="small"
                        type="number"
                        inputProps={{
                            // maxLength: 13,
                            step: step || 1,
                            min: min,
                            max: max,
                        }}
                        error={error != undefined}
                        onChange={(e) => {
                            onChange(e.target.value || MAX_SEQUENCE_NUMBER);
                        }}
                        value={!value || value >= MAX_SEQUENCE_NUMBER ? '' : value}
                        fullWidth
                        id={id ?? 'sequenceNumber'}
                        {...other}
                        label=""
                    />
                )}
            />
        </>
    );
}
