import { useGetDepartments } from '@/hooks/queries/useDepartments';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './utility/ErrorDisplay';
import { useTranslation } from 'react-i18next';

type Props = {
    companyId: number;
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectDepartment({ companyId, control, label, id, name }: Props) {
    const { t } = useTranslation();
    const { data, isError, error } = useGetDepartments({ companyId, relations: false });

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    valueType={'number'}
                    control={control}
                    label={label ?? t('Department')}
                    name={name ?? 'departmentId'}
                    id={id ?? 'departmentId'}
                    autoComplete="department"
                    options={
                        data?.map((o) => {
                            return { label: o.name, value: o.id };
                        }) ?? []
                    }
                />
            )}
        </>
    );
}
