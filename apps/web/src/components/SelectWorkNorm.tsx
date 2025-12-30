import { useGetWorkNormList } from '@/hooks/queries/useWorkNorm';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './ErrorDisplay';
import { useTranslation } from 'react-i18next';

interface Props {
    companyId: string | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ control, label, id, name }: Props) {
    const { data, isError, error } = useGetWorkNormList();
    const { t } = useTranslation();

    return (
        <>
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormAutocomplete
                    valueType={'number'}
                    control={control}
                    label={label ?? t('Work Norm')}
                    name={name ?? 'workNormId'}
                    id={id ?? 'workNormId'}
                    autoComplete="workNormId"
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
