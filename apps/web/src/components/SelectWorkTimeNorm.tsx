import { useGetWorkTimeNormList } from '@/hooks/queries/useWorkTimeNorm';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from './ErrorDisplay';
import { FormAutocomplete } from './form/FormAutocomplete';

interface Props {
    companyId: string | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkTimeNorm({ control, label, id, name }: Props) {
    const { data, isError, error } = useGetWorkTimeNormList();
    const { t } = useTranslation();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    valueType={'string'}
                    control={control}
                    label={label ?? t('Work Time Norm')}
                    name={name ?? 'workTimeNormId'}
                    id={id ?? 'workTimeNormId'}
                    autoComplete="workTimeNormId"
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
