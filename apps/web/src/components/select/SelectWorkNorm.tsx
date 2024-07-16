import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { workNormsFindAll } from '@/services/workNorm.service';
import { snackbarError } from '@/utils';
import { WorkNorm } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ companyId, control, label, id, name }: Props) {
    const { data, isError, error, isLoading } = useQuery<WorkNorm[], Error>({
        queryKey: [ResourceType.WORK_NORM, { companyId }],
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
