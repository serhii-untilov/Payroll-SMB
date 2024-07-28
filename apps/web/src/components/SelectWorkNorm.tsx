import useWorkNorm from '@/hooks/queries/useWorkNorm';
import { FormAutocomplete } from './form/FormAutocomplete';
import Error from './utility/Error';
import { Loading } from './utility/Loading';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ control, label, id, name }: Props) {
    const { data, isError, error, isLoading } = useWorkNorm();

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
                    autoComplete="workNorm"
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
