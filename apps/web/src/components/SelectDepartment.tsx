import { useDepartments } from '@/hooks/queries/useDepartments';
import { FormAutocomplete } from './form/FormAutocomplete';
import { Loading } from './utility/Loading';
import Error from './utility/Error';

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
            {isLoading && <Loading />}
            {isError && <Error error={error} />}
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
