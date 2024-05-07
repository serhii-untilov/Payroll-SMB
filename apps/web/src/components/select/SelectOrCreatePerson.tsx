import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { IPerson } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getPersonList } from '../../services/person.service';
import { InputLabel } from '../layout/InputLabel';
import { useMemo } from 'react';

export interface Props {
    name: string;
    control: any;
    label: string;
    autofocus?: boolean;
}

export const SelectOrCreatePerson = (props: Props) => {
    const {
        data: personList,
        isError,
        error,
    } = useQuery<IPerson[], Error>({
        queryKey: ['person', 'list'],
        queryFn: async () => {
            return await getPersonList();
        },
    });

    // const selectedValues = React.useMemo(() => allValues.filter((v) => v.selected), [allValues]);
    const options = useMemo(
        () =>
            personList?.map((o) => {
                return { label: o.fullName, value: o.id };
            }) || [],
        [personList],
    );

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
                        <Autocomplete
                            freeSolo
                            selectOnFocus
                            // disableCloseOnSelect
                            disablePortal
                            autoSelect
                            autoHighlight
                            autoComplete
                            id={'value'}
                            options={options}
                            // getOptionLabel={(option) => option?.label || ''}
                            // getOptionKey={(option) => option?.value || ''}
                            value={options.find((o) => o.value === value) || null}
                            // isOptionEqualToValue={(option, value) => {
                            //     return (
                            //         option?.value && value?.value && option?.value === value?.value
                            //     );
                            // }}
                            // onChange={(event, item) => {
                            //     onChange(item?.value || null);
                            // }}
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
