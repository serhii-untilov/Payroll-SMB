import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { CreatePersonDto, Person } from '@repo/openapi';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../../layout/InputLabel';
import CreatePerson from '../components/CreatePerson';
import { useDefaultValue } from '../hooks/useDefaultValue';
import { useOptions } from '../hooks/useOptions';
import { getOptionLabel } from '../hooks/getOptionLabel';
import { SelectPersonOption } from '../types/SelectPersonOption';

interface SelectPersonFormProps {
    name: string;
    control: any;
    label: string;
    autoFocus?: boolean;
    personList: Person[];
}

const filter = createFilterOptions<SelectPersonOption>();

export const SelectPersonForm = (props: SelectPersonFormProps) => {
    const { name, control, label, autoFocus, personList } = props;
    const { t } = useTranslation();
    const [open, toggleOpen] = useState(false);
    const defaultValue = useDefaultValue();
    const [dialogValue, setDialogValue] = useState<CreatePersonDto>(defaultValue);
    const options = useOptions(personList);

    const handleClose = () => {
        toggleOpen(false);
    };

    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                        <>
                            <Autocomplete
                                selectOnFocus
                                clearOnEscape
                                handleHomeEndKeys
                                disablePortal
                                autoComplete
                                options={options || []}
                                defaultValue={null}
                                getOptionLabel={getOptionLabel}
                                getOptionKey={(option) => option?.value || ''}
                                value={options?.find((o) => o.value === value) || null}
                                isOptionEqualToValue={(option, value) =>
                                    option?.value === value?.value
                                }
                                onChange={(_event, option) => {
                                    if (typeof option === 'string') {
                                        const [lastName, firstName, middleName] = (
                                            option as string
                                        ).split(' ', 3);
                                        // timeout to avoid instant validation of the dialog's form.
                                        setTimeout(() => {
                                            toggleOpen(true);
                                            setDialogValue({
                                                ...defaultValue,
                                                lastName,
                                                firstName,
                                                middleName,
                                            });
                                        });
                                    } else if (option && option.inputValue) {
                                        // Create a new value from the user input
                                        const [lastName, firstName, middleName] =
                                            option.inputValue.split(' ', 3);
                                        toggleOpen(true);
                                        setDialogValue({
                                            ...defaultValue,
                                            lastName,
                                            firstName,
                                            middleName,
                                        });
                                    } else {
                                        onChange(option?.value || null);
                                    }
                                }}
                                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some(
                                        (option) => inputValue === option.label,
                                    );
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            label: `${t('Add')} "${inputValue}"`,
                                            value: 0,
                                        });
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            autoFocus={!!autoFocus}
                                            autoComplete="SelectOrCreatePerson"
                                            error={error != undefined}
                                            variant="outlined"
                                            label=""
                                            {...params}
                                            size="small"
                                            fullWidth
                                            placeholder={t('Vacancy')}
                                        />
                                    );
                                }}
                            />
                            <CreatePerson
                                open={open}
                                handleClose={handleClose}
                                onChange={onChange}
                                dialogValue={dialogValue}
                                setDialogValue={setDialogValue}
                            />
                        </>
                    );
                }}
            />
        </>
    );
};
