import { Autocomplete, OutlinedInputProps, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { InputLabel } from '../layout/InputLabel';

export type FormAutocompleteOption = {
    label: string;
    value: any;
};

export type FormAutocompleteProps = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    options: FormAutocompleteOption[];
};

export const FormAutocomplete = (props: FormAutocompleteProps) => {
    return (
        <>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => {
                    return (
                        <Autocomplete
                            disablePortal
                            autoSelect
                            // autoHighlight !!!
                            autoComplete
                            // id={'value'}
                            options={props.options}
                            getOptionLabel={(option) => option?.label || ''}
                            getOptionKey={(option) => option?.value || ''}
                            value={props.options.find((o) => o.value === value) || null}
                            isOptionEqualToValue={(option, value) => {
                                return (
                                    option?.value && value?.value && option?.value === value?.value
                                );
                            }}
                            onChange={(event, item) => {
                                onChange(item?.value || null);
                            }}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        error={error != undefined}
                                        variant="outlined"
                                        label=""
                                        {...params}
                                        size="small"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    );
                }}
            />
        </>
    );
};
