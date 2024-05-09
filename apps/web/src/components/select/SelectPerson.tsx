import {
    Autocomplete,
    AutocompleteProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    createFilterOptions,
} from '@mui/material';
import { IPerson } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { Controller } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPerson, getPersonList } from '../../services/person.service';
import { InputLabel } from '../layout/InputLabel';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../layout/Button';

export interface Props {
    name: string;
    control: any;
    label: string;
    autoFocus?: boolean;
}

interface OptionType {
    inputValue?: string;
    label: string;
    value: number | null;
}

const filter = createFilterOptions<OptionType>();

const personDefaultValues = {
    lastName: '',
    firstName: '',
    middleName: '',
    taxId: '',
    birthDate: '',
    sex: '',
};

export const SelectPerson = (props: Props) => {
    const { t } = useTranslation();
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState(personDefaultValues);
    const queryClient = useQueryClient();

    const handleClose = () => {
        setDialogValue(personDefaultValues);
        toggleOpen(false);
    };

    const {
        data: options,
        isError,
        error,
    } = useQuery<OptionType[], Error>({
        queryKey: ['person', 'SelectPerson'],
        queryFn: async () => {
            const personList = await getPersonList();
            const fakePersonList = [
                { fullName: 'Mary Lee', id: 1 },
                { fullName: 'John Smith', id: 2 },
            ];
            return (personList.length ? personList : fakePersonList)
                .map((o) => {
                    return {
                        inputValue: '',
                        label: o.fullName || '',
                        value: o.id,
                    };
                })
                .sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()));
        },
    });

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    return (
        <>
            <InputLabel>{props.label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => {
                    return (
                        <>
                            <Autocomplete
                                selectOnFocus
                                clearOnEscape
                                handleHomeEndKeys
                                disablePortal
                                // autoSelect
                                // autoHighlight !!!
                                autoComplete
                                options={options || []}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.label || '';
                                }}
                                getOptionKey={(option) => option?.value || ''}
                                value={options?.find((o) => o.value === value) || null}
                                isOptionEqualToValue={(option, value) =>
                                    option?.value === value?.value
                                }
                                onChange={(event, option) => {
                                    console.log('onChange', option);
                                    if (typeof option === 'string') {
                                        const [lastName, firstName, middleName] = (
                                            option as string
                                        ).split(' ', 3);
                                        // timeout to avoid instant validation of the dialog's form.
                                        setTimeout(() => {
                                            toggleOpen(true);
                                            setDialogValue({
                                                ...personDefaultValues,
                                                lastName,
                                                firstName,
                                                middleName,
                                            });
                                        });
                                        // onChange(null);
                                    } else if (option && option.inputValue) {
                                        // onChange(null);
                                        // Create a new value from the user input
                                        const [lastName, firstName, middleName] =
                                            option.inputValue.split(' ', 3);
                                        toggleOpen(true);
                                        setDialogValue({
                                            ...personDefaultValues,
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
                                            label: `Add "${inputValue}"`,
                                            value: null,
                                        });
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            autoFocus={!!props?.autoFocus}
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
                            <Dialog open={open} onClose={handleClose}>
                                <form
                                    onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                                        event.preventDefault();
                                        const person = await createPerson({
                                            firstName: dialogValue.firstName,
                                            lastName: dialogValue.lastName,
                                            middleName: dialogValue.middleName,
                                            taxId: dialogValue.taxId,
                                            birthDate: dialogValue.birthDate
                                                ? new Date(dialogValue.birthDate)
                                                : null,
                                            sex: dialogValue.sex,
                                        });
                                        onChange(person.id);
                                        queryClient.invalidateQueries({
                                            queryKey: ['person'],
                                            refetchType: 'all',
                                        });
                                        handleClose();
                                    }}
                                >
                                    <DialogTitle>Add a new film</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Did you miss any film in our list? Please, add it!
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="lastName"
                                            value={dialogValue.lastName}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    lastName: event.target.value,
                                                })
                                            }
                                            label={t('Last Name')}
                                            type="text"
                                            variant="standard"
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="firstName"
                                            value={dialogValue.firstName}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    firstName: event.target.value,
                                                })
                                            }
                                            label={t('First Name')}
                                            type="text"
                                            variant="standard"
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="middleName"
                                            value={dialogValue.middleName}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    middleName: event.target.value,
                                                })
                                            }
                                            label={t('Middle Name')}
                                            type="text"
                                            variant="standard"
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="taxId"
                                            value={dialogValue.taxId}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    taxId: event.target.value,
                                                })
                                            }
                                            label={t('Tax ID')}
                                            type="text"
                                            variant="standard"
                                        />
                                        <TextField
                                            margin="dense"
                                            id="birthDate"
                                            value={dialogValue.birthDate}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    birthDate: event.target.value,
                                                })
                                            }
                                            label={t('Birth Date')}
                                            type="date"
                                            variant="standard"
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="sex"
                                            value={dialogValue.sex}
                                            onChange={(event) =>
                                                setDialogValue({
                                                    ...dialogValue,
                                                    sex: event.target.value,
                                                })
                                            }
                                            label={t('Sex')}
                                            type="text"
                                            variant="standard"
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button type="submit">{t('Add')}</Button>
                                        <Button color="secondary" onClick={handleClose}>
                                            {t('Cancel')}
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Dialog>
                        </>
                    );
                }}
            />
        </>
    );
};
