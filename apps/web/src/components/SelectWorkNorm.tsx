import useWorkNorm from '@/hooks/queries/useWorkNorm';
import { FormAutocomplete } from './form/FormAutocomplete';
import ErrorDisplay from './utility/ErrorDisplay';
import { LoadingDisplay } from './utility/LoadingDisplay';
import { useTranslation } from 'react-i18next';

interface Props {
    companyId: number | undefined;
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectWorkNorm({ control, label, id, name }: Props) {
    const { data, isError, error, isLoading } = useWorkNorm();
    const { t } = useTranslation();

    return (
        <>
            {isLoading && <LoadingDisplay />}
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
