import { useGetJobList } from '@/hooks/queries/useJob';
import { useTranslation } from 'react-i18next';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './ErrorDisplay';

type Props = {
    control: any;
    label?: string;
    id?: string;
    name?: string;
};

export function SelectJob({ control, label, id, name }: Props) {
    const { data, isError, error } = useGetJobList();
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
