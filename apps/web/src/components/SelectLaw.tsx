import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { useLaws } from '@/hooks/queries/useLaws';
import { useTranslation } from 'react-i18next';
import ErrorDisplay from './utility/ErrorDisplay';
import { LoadingDisplay } from './utility/LoadingDisplay';

type Props = {
    control: any;
};

export default function SelectLaw(props: Props) {
    const { data, isLoading, isError, error } = useLaws();
    const { t } = useTranslation();
    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {data && (
                <FormInputDropdown
                    control={props.control}
                    label={t('Law')}
                    name="lawId"
                    autoComplete="lawId"
                    type="number"
                    options={
                        data.map((o) => {
                            return { label: o.name, value: o.id };
                        }) ?? []
                    }
                />
            )}
        </>
    );
}
