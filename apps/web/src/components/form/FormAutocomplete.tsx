import { Autocomplete, InputLabel, OutlinedInputProps, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

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
    const getLabelByValue = (value: any) => {
        const found = props.options.find((o) => o.value === value);
        console.log('value', value, found);
        return found?.label;
    };
    return (
        <>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => {
                    // console.log('value', value, formState);
                    return (
                        <Autocomplete
                            disablePortal
                            // autoSelect
                            // autoHighlight
                            // id={'value'}
                            options={props.options}
                            value={props.options.find((o) => o.value === value)}
                            getOptionKey={(option) => option.value || ''}
                            getOptionLabel={(option) => option.label || ''}
                            isOptionEqualToValue={(option, value) => {
                                console.log('isOptionEqualToValue', option, value);
                                return option.value === value.value;
                            }}
                            renderInput={(params) => {
                                console.log('params', params);
                                return (
                                    <TextField
                                        error={error != undefined}
                                        onChange={(event) => {
                                            console.log('onChange', event);
                                            onChange(event);
                                        }}
                                        // value={value}
                                        // {...props}
                                        {...params}
                                        label=""
                                        size="small"
                                        fullWidth
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'disabled', // disable autocomplete and autofill
                                        }}
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
