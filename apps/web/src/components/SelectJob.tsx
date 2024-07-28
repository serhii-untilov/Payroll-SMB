import { useJobs } from '@/hooks/queries/useJobs';
import { FormAutocomplete } from './form/FormAutocomplete';
import { Loading } from './utility/Loading';
import Error from './utility/Error';

type Props = {
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectJob({ control, label, id, name }: Props) {
    const { data, isLoading, isError, error } = useJobs();

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
                    autoComplete="job"
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
