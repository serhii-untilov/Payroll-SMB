import { IDepartment } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { getDepartmentList } from '../../services/department.service';
import { enqueueSnackbar } from 'notistack';
import { FormAutocomplete } from '../form/FormAutocomplete';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectDepartment({ companyId, control, label, id, name }: Props) {
    const {
        data: departmentList,
        isError: isDepartmentListError,
        error: departmentListError,
    } = useQuery<IDepartment[], Error>({
        queryKey: ['department', 'list', { companyId }],
        queryFn: async () => {
            return companyId ? await getDepartmentList(companyId) : [];
        },
        enabled: !!companyId,
    });

    if (isDepartmentListError) {
        return enqueueSnackbar(`${departmentListError.name}\n${departmentListError.message}`, {
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
            autoComplete="department"
            options={
                departmentList?.map((o) => {
                    return { label: o.name, value: o.id };
                }) ?? []
            }
        />
    );
}
