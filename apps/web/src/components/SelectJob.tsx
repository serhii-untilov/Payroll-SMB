import { useJobs } from '@/hooks/queries/useJobs';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './utility/ErrorDisplay';
import { useTranslation } from 'react-i18next';

type Props = {
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectJob({ control, label, id, name }: Props) {
    const { data, isError, error } = useJobs();
    const { t } = useTranslation();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    valueType={'number'}
                    control={control}
                    label={label ?? t('Job')}
                    name={name ?? 'jobId'}
                    id={id ?? 'jobId'}
                    autoComplete="jobId"
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
