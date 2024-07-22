import { FormAutocomplete } from '@/components/form/FormAutocomplete';
import { useDepartmentList } from '@/hooks/useDepartmentList';

type Props = {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectDepartment({ companyId, control, label, id, name }: Props) {
    const { data: departmentList } = useDepartmentList({ companyId, relations: false });

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
