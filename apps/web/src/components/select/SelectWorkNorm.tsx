import { enqueueSnackbar } from 'notistack';
import { FormAutocomplete } from '../form/FormAutocomplete';
import { IWorkNorm } from '@repo/shared';
import { getWorkNormList } from '../../services/workNorm.service';
import { useQuery } from '@tanstack/react-query';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ companyId, control, label, id, name }: Props) {
    const {
        data: workNormList,
        isError: isWorkNormListError,
        error: workNormListError,
    } = useQuery<IWorkNorm[], Error>({
        queryKey: ['workNorm', 'list', { companyId }],
        queryFn: async () => {
            return companyId ? await getWorkNormList() : [];
        },
        enabled: !!companyId,
    });

    if (isWorkNormListError) {
        return enqueueSnackbar(`${workNormListError.name}\n${workNormListError.message}`, {
            variant: 'error',
        });
    }

    return (
        <FormAutocomplete
            valueType={'number'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="workNorm"
            options={
                workNormList?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
