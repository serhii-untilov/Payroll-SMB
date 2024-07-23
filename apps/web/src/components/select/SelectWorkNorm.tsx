import { workNormsFindAll } from '@/services/workNorm.service';
import { snackbarError } from '@/utils/snackbar';
import { ResourceType, WorkNorm } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';
import { FormAutocomplete } from '../form/FormAutocomplete';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ companyId, control, label, id, name }: Props) {
    const { data, isError, error, isLoading } = useQuery<WorkNorm[], Error>({
        queryKey: [ResourceType.WorkNorm],
        queryFn: async () => {
            return companyId ? await workNormsFindAll() : [];
        },
    });

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }

    if (isLoading) return null;

    return (
        <FormAutocomplete
            valueType={'number'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="workNorm"
            options={
                data?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
