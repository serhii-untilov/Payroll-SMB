import { useDepartments } from '@/hooks/queries/useDepartments';
import { FormAutocomplete } from './form/FormAutocomplete';
import { LoadingDisplay } from './utility/LoadingDisplay';
import ErrorDisplay from './utility/ErrorDisplay';

type Props = {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectDepartment({ companyId, control, label, id, name }: Props) {
    const { data, isLoading, isError, error } = useDepartments({ companyId, relations: false });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    valueType={'number'}
                    control={control}
                    label={label || ''}
                    name={name || id || ''}
                    id={id || name || ''}
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
