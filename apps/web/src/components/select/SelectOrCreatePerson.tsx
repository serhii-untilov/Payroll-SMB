import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { IPerson } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { getPersonList } from '../../services/person.service';
import { InputLabel } from '../layout/InputLabel';

export interface Props {
    name: string;
    control: any;
    label: string;
}

export const SelectOrCreatePerson = (props: Props) => {
    const { data, isError, error } = useQuery<IPerson[], Error>({
        queryKey: ['personList'],
        queryFn: async () => {
            const personList = await getPersonList();
            return personList.map((o) => {
                return { label: o.fullName, value: o.id };
            });
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
                        <Autocomplete
                            disablePortal
                            autoSelect
                            autoHighlight
                            autoComplete={true}
                            // id={'value'}
                            options={data}
                            getOptionLabel={(option) => option?.label || ''}
                            getOptionKey={(option) => option?.value || ''}
                            value={data.find((o) => o.value === value) || null}
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
